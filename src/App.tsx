import { useRef, useState } from "react";
import { TranslatePanel } from "./components/TranslatePanel";
import { ApiSettings } from "./components/ApiSettings";
import { TranslateSettings } from "./components/TranslateSettings";
import { HistoryPanel } from "./components/HistoryPanel";
import "./App.css";

type Tab = "translate" | "history" | "api" | "settings";

const tabs: { key: Tab; label: string }[] = [
  { key: "translate", label: "翻译" },
  { key: "history", label: "历史输入" },
  { key: "api", label: "API 设置" },
  { key: "settings", label: "翻译设置" },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("translate");
  const setInputRef = useRef<((text: string) => void) | null>(null);

  const handleHistorySelect = (text: string) => {
    setInputRef.current?.(text);
    setActiveTab("translate");
  };

  return (
    <div className="w-[400px] h-[550px] bg-zinc-900 text-zinc-100 flex flex-col overflow-hidden">
      <nav className="flex border-b border-zinc-700 bg-zinc-900 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "text-indigo-400 border-b-2 border-indigo-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-y-auto">
        <TranslatePanel
          display={activeTab === "translate"}
          setInputRef={setInputRef}
        />

        {activeTab === "history" && (
          <HistoryPanel onSelect={handleHistorySelect} />
        )}

        {activeTab === "api" && <ApiSettings />}

        {activeTab === "settings" && <TranslateSettings />}
      </div>
    </div>
  );
}

export default App;
