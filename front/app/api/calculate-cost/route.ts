export const runtime = 'edge';

import { NextResponse } from 'next/server'

const modelPrices = {
  'Sonnet-1': 0.0001,
  'Sonnet-2': 0.00015,
  'Sonnet-3': 0.0002,
  'Gemini-1': 0.00012,
  'Gemini-2': 0.00018,
  'Gemini-3': 0.00025,
  'GPT-3.5': 0.0002,
  'GPT-4': 0.0003,
  'GPT-4 Turbo': 0.00035,
  'DALL-E 3': 0.0004
}

export async function POST(request: Request) {
  const { model, inputWordCount, outputWordCount, requestCount, timeFrame } = await request.json()

  const costPerWord = modelPrices[model] || 0
  const inputCost = inputWordCount * costPerWord
  const outputCost = outputWordCount * costPerWord
  const totalCostPerRequest = inputCost + outputCost

  let multiplier = 1
  switch (timeFrame) {
    case 'week':
      multiplier = 7
      break
    case 'month':
      multiplier = 30
      break
    case 'year':
      multiplier = 365
      break
  }

  const totalCost = totalCostPerRequest * requestCount * multiplier

  const explanation = `The cost is calculated based on the ${model} model, which charges $${costPerWord.toFixed(6)} per word. 
    For a prompt of ${inputWordCount} words and an expected output of ${outputWordCount} words, 
    the cost per request is $${totalCostPerRequest.toFixed(4)}. 
    With ${requestCount} requests per ${timeFrame}, the total cost is $${totalCost.toFixed(4)}.`

  return NextResponse.json({ cost: totalCost, explanation })
}
