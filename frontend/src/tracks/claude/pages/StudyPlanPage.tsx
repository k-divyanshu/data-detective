import { Link } from 'react-router-dom'
import { Badge } from '../../../shared/components/Badge'
import { usePersistentState } from '../../../shared/usePersistentState'
import { ProvenanceBadge } from '../components/ProvenanceBadge'
import { examDomains, getDomain } from '../data/exam'
import { mockExams } from '../data/mockExams'
import { questionBank } from '../data/questions'
import { getResource, resources } from '../data/resources'
import { useClaudeProgress } from '../state/useClaudeProgress'
import { buildStudyPlan, MINUTES_PER_QUESTION, READ_MINUTES } from '../utils/studyPlan'

const DAY_CHOICES = [3, 5, 7, 10, 14, 21, 30]
const MINUTE_CHOICES = [30, 45, 60, 90, 120]

interface PlanSettings {
  days: number
  minutesPerDay: number
}

function isSettings(value: unknown): value is PlanSettings {
  const candidate = value as Partial<PlanSettings> | null
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    DAY_CHOICES.includes(candidate.days as number) &&
    MINUTE_CHOICES.includes(candidate.minutesPerDay as number)
  )
}

export function StudyPlanPage() {
  const { stats } = useClaudeProgress()
  const [settings, setSettings] = usePersistentState<PlanSettings>(
    'data-detective-claude-plan-settings-v1',
    { days: 7, minutesPerDay: 60 },
    isSettings,
  )

  const questionCountByDomain = Object.fromEntries(
    examDomains.map((domain) => [domain.id, questionBank.filter((q) => q.domainId === domain.id).length]),
  )
  const plan = buildStudyPlan({
    days: settings.days,
    minutesPerDay: settings.minutesPerDay,
    domains: examDomains,
    domainStats: stats.domainStats,
    resources,
    questionCountByDomain,
    mocks: mockExams,
  })
  const weakNames = stats.weakDomainIds.flatMap((id) => getDomain(id)?.name ?? [])

  return (
    <>
      <h1>Study Plan</h1>
      <p className="muted">
        A simple schedule built from the exam's domain weights and your own practice results. It updates
        automatically as you answer questions, so weak areas get more days. Times are rough estimates
        ({READ_MINUTES} minutes per reading, about {MINUTES_PER_QUESTION} minutes per question).
      </p>

      <section className="card field-inline">
        <label htmlFor="plan-days">I have</label>
        <select
          id="plan-days"
          value={settings.days}
          onChange={(event) => setSettings({ ...settings, days: Number(event.target.value) })}
        >
          {DAY_CHOICES.map((choice) => (
            <option key={choice} value={choice}>{choice} days</option>
          ))}
        </select>
        <label htmlFor="plan-minutes">and</label>
        <select
          id="plan-minutes"
          value={settings.minutesPerDay}
          onChange={(event) => setSettings({ ...settings, minutesPerDay: Number(event.target.value) })}
        >
          {MINUTE_CHOICES.map((choice) => (
            <option key={choice} value={choice}>{choice} minutes a day</option>
          ))}
        </select>
      </section>

      <p className="notice">
        {stats.totalAttempts === 0
          ? 'You have not answered any practice questions yet, so this plan follows the exam weights only.'
          : weakNames.length > 0
            ? `Extra time is given to your weak areas: ${weakNames.join(', ')}.`
            : 'No weak areas detected yet; time follows the exam weights and your accuracy so far.'}
      </p>

      <div className="plan-list">
        {plan.map((day) => (
          <article key={day.day} className="card plan-day">
            <div className="form-title">
              <h3>
                Day {day.day} · {day.title}
              </h3>
              <span className="muted small">about {day.minutes} min</span>
            </div>
            <ul className="plan-tasks">
              {day.tasks.map((task, index) => {
                const resource = task.resourceId ? getResource(task.resourceId) : undefined
                return (
                  <li key={index}>
                    {task.type === 'read' && resource && (
                      <>
                        <Badge tone="blue">Read</Badge>{' '}
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {task.label} ↗
                        </a>{' '}
                        <ProvenanceBadge source={resource.source} />
                      </>
                    )}
                    {task.type === 'practice' && (
                      <>
                        <Badge tone="amber">Practice</Badge>{' '}
                        <Link to={`/claude/practice?domain=${task.domainId}&count=${nearestChoice(task.questionCount ?? 10)}`}>
                          {task.label}
                        </Link>
                      </>
                    )}
                    {task.type === 'mock' && (
                      <>
                        <Badge tone="purple">Mock</Badge> <Link to="/claude/mock-exam">{task.label}</Link>
                      </>
                    )}
                    <span className="muted small"> · ~{task.minutes} min</span>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>
    </>
  )
}

// The practice page offers fixed set sizes, so link to the closest one.
function nearestChoice(count: number): number {
  const choices = [5, 10, 15, 20]
  return choices.reduce((best, choice) => (Math.abs(choice - count) < Math.abs(best - count) ? choice : best), choices[0])
}
