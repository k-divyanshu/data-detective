import { CodeBlock } from '../../../shared/components/CodeBlock'
import type { LessonBlock } from '../types'
import { InlineText } from './InlineText'

export function LessonView({ lesson }: { lesson: { title: string; blocks: LessonBlock[] } }) {
  return (
    <section className="card learning">
      <h2>{lesson.title}</h2>
      {lesson.blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h3 key={index}>{block.text}</h3>
          case 'paragraph':
            return (
              <p key={index} className={block.muted ? 'muted' : undefined}>
                <InlineText text={block.text} />
              </p>
            )
          case 'list':
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            )
          case 'code':
            return <CodeBlock key={index} language={block.language} code={block.code} />
        }
      })}
    </section>
  )
}
