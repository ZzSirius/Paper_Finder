// 开发环境通过 Vite 代理避免 CORS 问题，生产环境直接请求
const API_BASE = import.meta.env.DEV ? "/api/dify" : "https://api.dify.ai/v1";
const API_KEY = "app-9QjgTpfD9p1hvnV86GRSqa66";

/**
 * Search papers by keyword using Dify workflow (streaming mode)
 * @param {string} keyword - The search keyword
 * @returns {Promise<{papers: Array, taskId: string}>}
 */
export async function searchPapers(keyword) {
  const response = await fetch(`${API_BASE}/workflows/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: { keyword },
      response_mode: "streaming",
      user: "paper-search-user",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `API Error (${response.status}): ${errText || response.statusText}`
    );
  }

  // Parse streaming SSE response
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalOutputs = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      try {
        const event = JSON.parse(trimmed.slice(6));
        if (event.event === "workflow_finished") {
          finalOutputs = event.data?.outputs;
        }
      } catch {
        // skip non-JSON SSE lines
      }
    }
  }

  if (!finalOutputs) {
    throw new Error("Workflow did not return outputs");
  }

  const rawOutput = finalOutputs.out || [];
  const papers = parsePapers(rawOutput);

  return { papers };
}

/**
 * Parse raw text output into structured paper objects
 * @param {string[]} rawOutput - Array of raw paper text blocks
 * @returns {Array<{title: string, authors: string, published: string, summary: string}>}
 */
function parsePapers(rawOutput) {
  if (!Array.isArray(rawOutput)) return [];

  return rawOutput
    .map((text) => {
      if (!text) return null;

      const titleMatch = text.match(/Title:\s*(.+)/i);
      const authorsMatch = text.match(/Authors:\s*(.+)/i);
      const publishedMatch = text.match(/Published:\s*(.+)/i);
      const summaryMatch = text.match(/Summary:\s*([\s\S]*?)(?:\n\n|$)/i);

      return {
        title: titleMatch ? titleMatch[1].trim() : "",
        authors: authorsMatch ? authorsMatch[1].trim() : "",
        published: publishedMatch ? publishedMatch[1].trim() : "",
        summary: summaryMatch ? summaryMatch[1].trim() : text,
        raw: text,
      };
    })
    .filter(Boolean);
}
