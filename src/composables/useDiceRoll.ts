import type { DiceRollConfig, DiceRollResult } from '@/types'

/**
 * Roll a single d6 die
 * @returns Random value from 1 to 6
 */
function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

/**
 * Roll multiple d6 dice
 * @param count Number of dice to roll
 * @returns Array of results (each 1-6)
 */
function rollMultipleD6(count: number): number[] {
  return Array.from({ length: count }, () => rollD6())
}

/**
 * Count successes in dice results (6s only)
 * @param results Array of dice results
 * @returns Number of 6s rolled
 */
function countSuccesses(results: number[]): number {
  return results.filter((r) => r === 6).length
}

/**
 * Check if panic was triggered (any 1 in stress dice)
 * @param stressDiceResults Array of stress dice results
 * @returns True if any stress die shows 1
 */
function checkPanic(stressDiceResults: number[]): boolean {
  return stressDiceResults.some((r) => r === 1)
}

/**
 * Roll action dice for Alien RPG
 *
 * @param config Dice pool configuration (base dice + stress dice)
 * @returns Roll results with successes count and panic status
 */
export function rollDice(config: DiceRollConfig): DiceRollResult {
  const baseDiceResults = rollMultipleD6(config.baseDice)
  const stressDiceResults = rollMultipleD6(config.stressDice)

  const allResults = [...baseDiceResults, ...stressDiceResults]
  const successes = countSuccesses(allResults)
  const panicTriggered = checkPanic(stressDiceResults)

  return {
    baseDiceResults,
    stressDiceResults,
    successes,
    panicTriggered,
  }
}
