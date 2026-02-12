
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-auth-token, Ocp-Apim-Subscription-Key, X-Microsoft-OutputFormat",
        "Access-Control-Max-Age": "86400"
      }
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1. 获取环境变量
    const AZURE_KEY = env.AZURE_TTS_KEY;
    const AZURE_REGION = env.AZURE_TTS_REGION || "eastus";

    if (!AZURE_KEY) {
      throw new Error("Server configuration error: AZURE_TTS_KEY not set");
    }

    // 2. 获取前端请求体 (SSML)
    // 注意：script.js 发送的是 text/plain 或 application/ssml+xml 的 body，不是 JSON
    const ssml = await request.text();

    if (!ssml) {
        throw new Error("Empty request body");
    }

    // 3. 构造 Azure TTS 请求 URL
    const azureUrl = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

    // 4. 转发请求到 Azure
    const response = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "LibreTTS"
      },
      body: ssml
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure TTS Error: ${response.status} ${errorText}`);
      throw new Error(`Azure TTS Failed: ${response.status} ${response.statusText}`);
    }

    // 5. 返回音频数据
    const audioData = await response.arrayBuffer();
    return new Response(audioData, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
