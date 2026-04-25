import { useStorage } from "../hooks/useStorage";
import { STORAGE_KEYS } from "../lib/constants";

type Props = {
  onSelect: (text: string) => void;
};

export function HistoryPanel({ onSelect }: Props) {
  const { value: raw, loaded } = useStorage(STORAGE_KEYS.HISTORY);
  const history: string[] = raw ? JSON.parse(raw) : [];

  if (!loaded) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3">
        {history.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center mt-8">暂无历史记录</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index}>
                <button
                  className="w-full text-left text-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-2 border border-zinc-700 hover:border-zinc-500 transition-colors line-clamp-3"
                  onClick={() => onSelect(item)}
                  title={item}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="shrink-0 border-t border-zinc-700 px-3 py-2">
        <p className="text-xs text-zinc-500 text-center">
          仅保存最近 50 条记录
        </p>
      </div>
    </div>
  );
}
