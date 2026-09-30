import type { Question } from '../../types'
import { agentsWorkflowsQuestions } from './agentsWorkflows'
import { applicationsIntegrationQuestions } from './applicationsIntegration'
import { claudeCodeQuestions } from './claudeCode'
import { evalTestingDebuggingQuestions } from './evalTestingDebugging'
import { modelSelectionOptimizationQuestions } from './modelSelectionOptimization'
import { promptContextEngineeringQuestions } from './promptContextEngineering'
import { securitySafetyQuestions } from './securitySafety'
import { toolsMcpQuestions } from './toolsMcp'

// One file per exam domain keeps the bank easy to review and extend.
export const questionBank: Question[] = [
  ...applicationsIntegrationQuestions,
  ...modelSelectionOptimizationQuestions,
  ...agentsWorkflowsQuestions,
  ...promptContextEngineeringQuestions,
  ...toolsMcpQuestions,
  ...securitySafetyQuestions,
  ...claudeCodeQuestions,
  ...evalTestingDebuggingQuestions,
]

export function getQuestion(questionId: string): Question | undefined {
  return questionBank.find((question) => question.id === questionId)
}
