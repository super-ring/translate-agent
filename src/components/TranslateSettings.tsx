import { useState } from "react";
import { useStorage } from "../hooks/useStorage";
import { STORAGE_KEYS, DEFAULT_SKILL } from "../lib/constants";

export function TranslateSettings() {
  const {
    value: skill,
    setValue: setSkill,
    save: saveSkill,
    loaded: skillLoaded,
  } = useStorage(STORAGE_KEYS.SKILL, DEFAULT_SKILL);
  const {
    value: whitelist,
    setValue: setWhitelist,
    save: saveWhitelist,
    loaded: whitelistLoaded,
  } = useStorage(STORAGE_KEYS.WHITELIST);

  const [saved, setSaved] = useState(false);

  if (!skillLoaded || !whitelistLoaded) {
    return <div className="p-4 text-zinc-500 text-sm">加载中...</div>;
  }

  const handleSave = async () => {
    await Promise.all([saveSkill(skill), saveWhitelist(whitelist)]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = async () => {
    setSkill(DEFAULT_SKILL);
    setWhitelist("");
    await Promise.all([saveSkill(DEFAULT_SKILL), saveWhitelist("")]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">
          翻译 Skill（System Prompt）
        </label>
        <textarea
          className="w-full h-52 bg-zinc-800 text-zinc-100 rounded-lg p-3 text-xs resize-none border border-zinc-600 focus:border-indigo-500 focus:outline-none placeholder-zinc-500 font-mono leading-relaxed"
          placeholder="输入翻译 Skill..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-1">
          免翻译白名单（每行一个词）
        </label>
        <textarea
          className="w-full h-24 bg-zinc-800 text-zinc-100 rounded-lg p-3 text-sm resize-none border border-zinc-600 focus:border-indigo-500 focus:outline-none placeholder-zinc-500 font-mono"
          placeholder={"React\nTypeScript\nVite"}
          value={whitelist}
          onChange={(e) => setWhitelist(e.target.value)}
        />
        <p className="text-xs text-zinc-500 mt-1">
          白名单中的词汇在翻译时将保持原文不变
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          onClick={handleSave}
        >
          {saved ? "已保存 ✓" : "保存设置"}
        </button>
        <button
          className="px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm font-medium py-2 rounded-lg transition-colors"
          onClick={handleReset}
        >
          重置默认
        </button>
      </div>
    </div>
  );
}
