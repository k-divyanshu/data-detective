import type { ChallengeDefinition } from '../types'
import { duplicateOrders } from './duplicateOrders'
import { missingCustomerIds } from './missingCustomerIds'
import { ordersVanishAfterJoin } from './ordersVanishAfterJoin'
import { unexpectedRevenueDrop } from './unexpectedRevenueDrop'

// To add a challenge: write a definition file in this folder and list it here.
export const challengeDefinitions: ChallengeDefinition[] = [
  duplicateOrders,
  missingCustomerIds,
  unexpectedRevenueDrop,
  ordersVanishAfterJoin,
]

export function getChallengeDefinition(challengeId: string): ChallengeDefinition | undefined {
  return challengeDefinitions.find((definition) => definition.id === challengeId)
}
