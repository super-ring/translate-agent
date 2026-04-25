import Markdown from "markdown-to-jsx";

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
    <div className="text-sm p-3 whitespace-pre-wrap wrap-break-word [&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word [&_ol]:list-decimal [&_ul]:list-disc">
      <Markdown
        options={{
          overrides: {
            strong: { props: { className: "text-indigo-300" } },
            ul: { props: { className: "my-1 pl-4" } },
            ol: { props: { className: "my-1 pl-4" } },
            li: { props: { className: "my-0.5" } },
            code: {
              props: { className: "bg-zinc-800 text-amber-300" },
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
