export const runtime = 'edge';

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { prompt, model, outputLength } = await request.json()

  // This is a placeholder calculation. Replace with your actual pricing logic.
  let costPerWord = 0
  switch (model) {
    case 'gpt4':
      costPerWord = 0.0002
      break
    case 'gemini-1.5-flash':
      costPerWord = 0.0001
      break
    case 'gemini-1.5-pro':
      costPerWord = 0.00015
      break
    default:
      costPerWord = 0
  }

  const inputCost = prompt.split(' ').length * costPerWord
  const outputCost = outputLength * costPerWord
  const totalCost = inputCost + outputCost

  return NextResponse.json({ cost: totalCost })
}
