import { useState, useRef } from "react";
import { useStorage } from "../hooks/useStorage";
import { streamChat } from "../lib/api";
import { STORAGE_KEYS, DEFAULT_SKILL } from "../lib/constants";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function TranslatePanel() {
  const { value: apiUrl } = useStorage(STORAGE_KEYS.API_URL);
  const { value: apiKey } = useStorage(STORAGE_KEYS.API_KEY);
  const { value: model } = useStorage(STORAGE_KEYS.MODEL);
  const { value: skill } = useStorage(STORAGE_KEYS.SKILL, DEFAULT_SKILL);
  const {
    value: savedInput,
    save: saveInput,
    loaded: inputLoaded,
  } = useStorage(STORAGE_KEYS.INPUT);

  const [input, setInput] = useState("");
  const [inputInitialized, setInputInitialized] = useState(false);
  const [output, setOutput] = useState("");
  const [rawMode, setRawMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // 从 localStorage 恢复上次输入
  if (inputLoaded && !inputInitialized) {
    if (savedInput) setInput(savedInput);
    setInputInitialized(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    saveInput(val);
  };

  const handleTranslate = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!apiUrl || !apiKey || !model) {
      setOutput(
        "**错误**: 请先在「API 设置」中配置 API 地址、密钥和模型名称。",
      );
      return;
    }

    setLoading(true);
    setOutput("");
    abortRef.current = new AbortController();

    const systemPrompt = skill || DEFAULT_SKILL;

    try {
      let accumulated = "";
      for await (const chunk of streamChat(apiUrl, apiKey, model, [
        { role: "system", content: systemPrompt },
        { role: "user", content: trimmed },
      ])) {
        accumulated += chunk;
        setOutput(accumulated);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setOutput(`**翻译失败**: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-zinc-700">
        <textarea
          className="w-full h-28 bg-zinc-800 text-zinc-100 rounded-lg p-3 text-sm resize-none border border-zinc-600 focus:border-indigo-500 focus:outline-none placeholder-zinc-500"
          placeholder="输入要翻译的文本... (Ctrl+Enter 发送)"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors"
          onClick={handleTranslate}
          disabled={loading || !input.trim()}
        >
          {loading ? "翻译中..." : "翻译"}
        </button>
      </div>
      <div className="flex items-center justify-end px-3 pt-2">
        {output && (
          <button
            className="text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-600 hover:border-zinc-400 p-0.5 rounded transition-colors mb-0.5"
            onClick={() => setRawMode(!rawMode)}
          >
            {rawMode ? "渲染模式" : "文本模式"}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {rawMode ? (
          <div className="h-full p-1">
            <textarea
              className="w-full h-full bg-zinc-800 text-zinc-100 p-3 text-sm resize-none border border-indigo-500 rounded-lg focus:outline-none font-mono leading-relaxed"
              value={output}
            />
          </div>
        ) : (
          <MarkdownRenderer content={output} />
        )}
      </div>
    </div>
  );
}
