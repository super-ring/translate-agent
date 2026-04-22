import { useStorage } from "../hooks/useStorage";
import { STORAGE_KEYS } from "../lib/constants";

export function ApiSettings() {
  const {
    value: apiUrl,
    save: saveApiUrl,
    loaded: urlLoaded,
  } = useStorage(STORAGE_KEYS.API_URL);
  const {
    value: apiKey,
    save: saveApiKey,
    loaded: keyLoaded,
  } = useStorage(STORAGE_KEYS.API_KEY);
  const {
    value: model,
    save: saveModel,
    loaded: modelLoaded,
  } = useStorage(STORAGE_KEYS.MODEL);

  if (!urlLoaded || !keyLoaded || !modelLoaded) {
    return <div className="p-4 text-zinc-500 text-sm">加载中...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">
          API Base URL
        </label>
        <input
          type="url"
          className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm border border-zinc-600 focus:border-indigo-500 focus:outline-none placeholder-zinc-500"
          placeholder="https://api.openai.com"
          value={apiUrl}
          onChange={(e) => saveApiUrl(e.target.value)}
        />
        <p className="text-xs text-zinc-500 mt-1">
          OpenAI 兼容接口地址，无需包含 /v1/chat/completions
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">
          API Key
        </label>
        <input
          type="password"
          className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm border border-zinc-600 focus:border-indigo-500 focus:outline-none placeholder-zinc-500"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => saveApiKey(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">
          模型名称
        </label>
        <input
          type="text"
          className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-3 py-2 text-sm border border-zinc-600 focus:border-indigo-500 focus:outline-none placeholder-zinc-500"
          placeholder="gpt-4o-mini"
          value={model}
          onChange={(e) => saveModel(e.target.value)}
        />
      </div>

      <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <p className="text-xs text-zinc-400 leading-relaxed">
          🔒 <strong className="text-zinc-300">隐私声明</strong>：所有数据（API
          密钥、翻译设置等）仅存储在您的浏览器本地，不会上传到任何服务器。翻译请求仅发送至您配置的
          API 地址。
        </p>
      </div>
    </div>
  );
}
