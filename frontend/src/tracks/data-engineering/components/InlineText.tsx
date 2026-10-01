import type { ReactNode } from 'react'

// Renders `code` and *emphasis* inside a plain string, so challenge text can stay as data.
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*[^*]+\*)/g)
  const nodes: ReactNode[] = parts.map((part, index) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    return part
  })
  return <>{nodes}</>
}
