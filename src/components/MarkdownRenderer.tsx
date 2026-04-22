import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

export function MarkdownRenderer({ content }: Props) {
  if (!content) {
    return (
      <div className="text-zinc-500 text-sm p-3">
        如果对翻译结果不满意
        <br />
        🫱 大模型输出不稳定，请多试几次
        <br />
        🫱 请调整翻译设置中的 Skill
        <br />
        🫱 或者换一个好点的大模型
      </div>
    );
  }

  return (
    <div className="prose prose-sm prose-invert max-w-none p-3 text-sm leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h4]:text-xs [&_strong]:text-indigo-300 [&_code]:text-amber-300 [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:rounded [&_hr]:my-2 [&_blockquote]:border-indigo-500 [&_blockquote]:text-zinc-400">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
