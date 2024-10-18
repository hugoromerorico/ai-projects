'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function PromptPrice() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('')
  const [outputLength, setOutputLength] = useState('')
  const [cost, setCost] = useState<number | null>(null)

  const handleCalculate = async () => {
    try {
      const response = await fetch('/api/calculate-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model, outputLength: parseInt(outputLength) }),
      })
      const data = await response.json()
      setCost(data.cost)
    } catch (error) {
      console.error('Error calculating cost:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Prompt Price Calculator</h1>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt4">GPT-4</SelectItem>
            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Estimated output length (words)"
          value={outputLength}
          onChange={(e) => setOutputLength(e.target.value)}
        />
        <Button onClick={handleCalculate}>Calculate Cost</Button>
      </div>
      {cost !== null && (
        <div className="mt-4">
          <p className="text-xl">Estimated Cost: ${cost.toFixed(4)}</p>
        </div>
      )}
    </div>
  )
}
