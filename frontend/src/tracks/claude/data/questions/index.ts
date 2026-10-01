import type { Question } from '../../types'
import { agentsWorkflowsQuestions } from './agentsWorkflows'
import { agentsWorkflowsMoreQuestions } from './agentsWorkflowsMore'
import { applicationsIntegrationQuestions } from './applicationsIntegration'
import { applicationsIntegrationApiQuestions } from './applicationsIntegrationApi'
import { applicationsIntegrationEngineeringQuestions } from './applicationsIntegrationEngineering'
import { claudeCodeQuestions } from './claudeCode'
import { claudeCodeMoreQuestions } from './claudeCodeMore'
import { evalTestingDebuggingQuestions } from './evalTestingDebugging'
import { evalTestingDebuggingMoreQuestions } from './evalTestingDebuggingMore'
import { modelSelectionOptimizationQuestions } from './modelSelectionOptimization'
import { modelSelectionMoreQuestions } from './modelSelectionMore'
import { multiResponseQuestions } from './multiResponse'
import { promptContextEngineeringQuestions } from './promptContextEngineering'
import { promptContextMoreQuestions } from './promptContextMore'
import { securitySafetyQuestions } from './securitySafety'
import { securitySafetyMoreQuestions } from './securitySafetyMore'
import { toolsMcpQuestions } from './toolsMcp'
import { toolsMcpMoreQuestions } from './toolsMcpMore'

// One or more files per exam domain keeps the bank easy to review and extend.
export const questionBank: Question[] = [
  ...applicationsIntegrationQuestions,
  ...applicationsIntegrationApiQuestions,
  ...applicationsIntegrationEngineeringQuestions,
  ...modelSelectionOptimizationQuestions,
  ...modelSelectionMoreQuestions,
  ...agentsWorkflowsQuestions,
  ...agentsWorkflowsMoreQuestions,
  ...promptContextEngineeringQuestions,
  ...promptContextMoreQuestions,
  ...toolsMcpQuestions,
  ...toolsMcpMoreQuestions,
  ...securitySafetyQuestions,
  ...securitySafetyMoreQuestions,
  ...claudeCodeQuestions,
  ...claudeCodeMoreQuestions,
  ...evalTestingDebuggingQuestions,
  ...evalTestingDebuggingMoreQuestions,
  ...multiResponseQuestions,
]

export function getQuestion(questionId: string): Question | undefined {
  return questionBank.find((question) => question.id === questionId)
}
