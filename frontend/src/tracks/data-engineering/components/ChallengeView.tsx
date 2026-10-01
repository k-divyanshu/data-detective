import { StatCard } from '../../../shared/components/StatCard'
import { useProgress } from '../progress/useProgress'
import type { ChallengeContent } from '../types'
import { AnswerForm } from './AnswerForm'
import { InlineText } from './InlineText'
import { LessonView } from './LessonView'
import { ProblemCard } from './ProblemCard'
import { RatioBar } from './RatioBar'
import { SqlRunner } from './SqlRunner'

interface ChallengeViewProps {
  challengeId: string
  content: ChallengeContent
}

// Renders any challenge definition: problem, symptoms, datasets, SQL playground, questions, lesson.
export function ChallengeView({ challengeId, content }: ChallengeViewProps) {
  const { isCompleted, markCompleted } = useProgress()
  const { summary } = content

  return (
    <>
      <ProblemCard meta={content.problem.meta}>
        <InlineText text={content.problem.text} />
      </ProblemCard>

      <section>
        <h2>Investigation summary</h2>
        <div className="grid grid-4">
          {summary.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {summary.callout && (
          <div className="card callout">
            <strong>{summary.callout.headline}</strong>
            {summary.callout.detail && <span className="muted"> {summary.callout.detail}</span>}
            {summary.callout.ratio && <RatioBar {...summary.callout.ratio} />}
          </div>
        )}

        {summary.extra && <div className="summary-extra">{summary.extra}</div>}
      </section>

      {content.tables.map((table) => (
        <section key={table.title}>
          <h2>Dataset: {table.title}</h2>
          {table.render()}
        </section>
      ))}

      <SqlRunner tables={content.sql.tables} suggestions={content.sql.suggestions} historyKey={challengeId} />

      <AnswerForm
        questions={content.questions}
        alreadyCompleted={isCompleted(challengeId)}
        onAllCorrect={() => markCompleted(challengeId)}
      />

      <LessonView lesson={content.lesson} />
    </>
  )
}
