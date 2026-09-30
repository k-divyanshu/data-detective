export function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="code-block">
      <div className="code-block-header">{language}</div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
