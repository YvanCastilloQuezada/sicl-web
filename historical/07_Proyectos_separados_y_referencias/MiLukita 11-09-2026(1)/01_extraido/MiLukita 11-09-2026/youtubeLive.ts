export type YoutubeLiveStatus = {
  status: "LIVE" | "UPCOMING" | "NONE" | "BLOCKED" | "ERROR";
  videoId?: string;
  title?: string;
  actualStartTime?: string;
  scheduledStartTime?: string;
  checkedAt: string;
  reason?: string;
};

function youtubeConfig() {
  return {
    apiKey: process.env.YOUTUBE_API_KEY ?? "",
    channelId: process.env.YOUTUBE_CHANNEL_ID ?? "",
  };
}

export async function getYoutubeLiveStatus(): Promise<YoutubeLiveStatus> {
  const checkedAt = new Date().toISOString();
  const { apiKey, channelId } = youtubeConfig();
  if (!apiKey || !channelId) return { status: "BLOCKED", checkedAt, reason: "Faltan YOUTUBE_API_KEY o YOUTUBE_CHANNEL_ID; se mantiene el estado local/manual." };
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("eventType", "live");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("key", apiKey);
  try {
    const response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { status: "ERROR", checkedAt, reason: `YouTube respondió HTTP ${response.status}.` };
    const body = await response.json() as { items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; liveBroadcastContent?: string; publishedAt?: string } }> };
    const item = body.items?.[0];
    if (!item?.id?.videoId) return { status: "NONE", checkedAt, reason: "No hay una transmisión en vivo detectada." };
    return { status: item.snippet?.liveBroadcastContent === "upcoming" ? "UPCOMING" : "LIVE", videoId: item.id.videoId, title: item.snippet?.title, checkedAt };
  } catch (error) {
    return { status: "ERROR", checkedAt, reason: error instanceof Error ? error.message : "Error desconocido consultando YouTube." };
  }
}
