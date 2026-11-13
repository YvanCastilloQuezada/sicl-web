/**
 * Tipos del motor RAG de normativa.
 *
 * MVP con TF-IDF (sin embeddings externos).
 * Referencia: RIBA Journal (2026) — el knowledge management es el uso #1 de LLMs
 * en estudios grandes (SOM, Foster, ZHA).
 */

/** Tipo de documento indexado. */
export type DocumentType = "RNE" | "EUROCODE" | "IBC" | "BUILDING_PERMIT" | "LESSON_LEARNED";

/** Documento indexado. */
export type RagDocument = {
  /** ID único del documento. */
  id: string;
  /** Título legible. */
  title: string;
  /** Fuente (ej. "RNE A.010", "Permit 2023-0045"). */
  source: string;
  /** Contenido textual. */
  content: string;
  /** Tipo de documento. */
  type: DocumentType;
};

/** Índice TF-IDF. */
export type TfIdfIndex = {
  /** Documentos indexados. */
  documents: RagDocument[];
  /** IDF por término. */
  idf: Map<string, number>;
  /** TF-IDF por (término, docId). */
  tfidf: Map<string, Map<string, number>>;
  /** Total de documentos. */
  N: number;
};

/** Resultado de una query. */
export type RagResult = {
  /** Documento. */
  document: RagDocument;
  /** Score de similitud (coseno). */
  score: number;
};
