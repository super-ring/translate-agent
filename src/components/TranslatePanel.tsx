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
  const { value: whitelist } = useStorage(STORAGE_KEYS.WHITELIST);
  const {
    value: savedInput,
    save: saveInput,
    loaded: inputLoaded,
  } = useStorage(STORAGE_KEYS.INPUT);

  const [input, setInput] = useState("");
  const [inputInitialized, setInputInitialized] = useState(false);
  const [output, setOutput] = useState("");
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

    const whitelistItems = whitelist
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    let systemPrompt = skill || DEFAULT_SKILL;
    if (whitelistItems.length > 0) {
      systemPrompt += `\n\n## 免翻译白名单\n以下词汇在翻译时请保持原文不翻译，但需要保证整个句子的翻译通顺完整：\n${whitelistItems.join(", ")}`;
    }

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
      <div className="flex-1 overflow-y-auto">
        <MarkdownRenderer content={output} />
      </div>
    </div>
  );
}
