/**
 * Índice TF-IDF para RAG de normativa.
 *
 * Sin dependencias externas. Sin embeddings. Sin latencia de red.
 * Para corpus de 35 docs, es instantáneo.
 */

import type { RagDocument, TfIdfIndex, RagResult } from "./types";

/** Stopwords en español. */
const STOPWORDS = new Set([
  "el", "la", "los", "las", "de", "del", "al", "a", "y", "o", "u",
  "en", "con", "por", "para", "que", "se", "su", "sus", "es", "son",
  "un", "una", "unos", "unas", "lo", "le", "les", "como", "más", "pero",
  "si", "no", "ni", "este", "esta", "estos", "estas", "ese", "esa",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-záéíóúñ0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/** Construye el índice TF-IDF. */
export function buildIndex(documents: RagDocument[]): TfIdfIndex {
  const N = documents.length;
  const df = new Map<string, number>();
  const tfidf = new Map<string, Map<string, number>>();
  const docTermFreq = new Map<string, Map<string, number>>();

  // Calcular TF por documento
  for (const doc of documents) {
    const tokens = tokenize(`${doc.title} ${doc.content} ${doc.source}`);
    const freq = new Map<string, number>();
    for (const t of tokens) {
      freq.set(t, (freq.get(t) ?? 0) + 1);
    }
    docTermFreq.set(doc.id, freq);
    for (const t of freq.keys()) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }

  // Calcular IDF
  const idf = new Map<string, number>();
  for (const [term, docFreq] of df) {
    idf.set(term, Math.log(N / docFreq));
  }

  // Calcular TF-IDF
  for (const doc of documents) {
    const freq = docTermFreq.get(doc.id)!;
    const termMap = new Map<string, number>();
    const maxFreq = Math.max(...freq.values());
    for (const [term, count] of freq) {
      const tf = count / maxFreq;
      const termIdf = idf.get(term) ?? 0;
      termMap.set(term, tf * termIdf);
    }
    tfidf.set(doc.id, termMap);
  }

  return { documents, idf, tfidf, N };
}

/** Consulta el índice y retorna los topK documentos más relevantes. */
export function query(index: TfIdfIndex, question: string, topK: number = 3): RagResult[] {
  const qTokens = tokenize(question);
  if (qTokens.length === 0) return [];

  // Vector de la pregunta (TF-IDF)
  const qFreq = new Map<string, number>();
  for (const t of qTokens) qFreq.set(t, (qFreq.get(t) ?? 0) + 1);
  const qMax = Math.max(...qFreq.values());
  const qVector = new Map<string, number>();
  for (const [term, count] of qFreq) {
    const tf = count / qMax;
    const termIdf = index.idf.get(term) ?? 0;
    if (termIdf > 0) qVector.set(term, tf * termIdf);
  }

  if (qVector.size === 0) return [];

  // Calcular similitud de coseno
  const results: RagResult[] = [];
  for (const doc of index.documents) {
    const docVector = index.tfidf.get(doc.id)!;
    let dot = 0;
    let qNorm = 0;
    let dNorm = 0;
    for (const [term, qVal] of qVector) {
      qNorm += qVal * qVal;
      const dVal = docVector.get(term) ?? 0;
      dot += qVal * dVal;
      dNorm += dVal * dVal;
    }
    if (dot === 0) continue;
    const score = dot / (Math.sqrt(qNorm) * Math.sqrt(dNorm));
    results.push({ document: doc, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}
