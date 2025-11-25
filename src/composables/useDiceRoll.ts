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

/**
 * Push a previous roll - re-roll all non-6 dice and add one new stress die
 *
 * In Alien RPG, pushing allows re-rolling all dice that didn't show a 6,
 * but costs +1 stress (which also gets rolled as an additional stress die).
 * Panic is only checked on newly rolled stress dice (re-rolled + new stress die).
 *
 * @param previousResult The original roll result to push
 * @returns New roll results combining kept 6s with re-rolled dice
 */
export function pushRoll(previousResult: DiceRollResult): DiceRollResult {
  // Separate kept 6s from dice to re-roll
  const keptBaseDice = previousResult.baseDiceResults.filter((r) => r === 6)
  const keptStressDice = previousResult.stressDiceResults.filter((r) => r === 6)

  const rerollBaseCount = previousResult.baseDiceResults.filter((r) => r !== 6).length
  const rerollStressCount = previousResult.stressDiceResults.filter((r) => r !== 6).length

  // Re-roll non-6s
  const rerolledBaseDice = rollMultipleD6(rerollBaseCount)
  const rerolledStressDice = rollMultipleD6(rerollStressCount)

  // Roll the new stress die from +1 stress
  const newStressDie = rollMultipleD6(1)

  // Combine results
  const baseDiceResults = [...keptBaseDice, ...rerolledBaseDice]
  const stressDiceResults = [...keptStressDice, ...rerolledStressDice, ...newStressDie]

  const allResults = [...baseDiceResults, ...stressDiceResults]
  const successes = countSuccesses(allResults)

  // Check panic only on newly rolled stress dice (re-rolled + new stress die)
  // Kept 6s cannot trigger panic since they weren't rolled
  const panicCheckDice = [...rerolledStressDice, ...newStressDie]
  const panicTriggered = checkPanic(panicCheckDice)

  return {
    baseDiceResults,
    stressDiceResults,
    successes,
    panicTriggered,
    isPushed: true,
  }
}
