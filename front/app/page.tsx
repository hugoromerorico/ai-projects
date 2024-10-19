'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Package2Icon } from 'lucide-react'
import Image from 'next/image'

const tools = [
  { 
    id: 'prompt-price', 
    name: 'Prompt Price Calculator', 
    description: 'Calculate the cost of your AI prompts',
    component: PromptPriceCalculator
  },
  { 
    id: 'llm-playground', 
    name: 'LLM Playground', 
    description: 'Try out different Language Models',
    component: LLMPlayground
  },
  { 
    id: 'prompt-saver', 
    name: 'Prompt Saver', 
    description: 'Save and organize your AI prompts',
    component: PromptSaver
  },
]

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null)

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <div 
          className="flex items-center space-x-2 mb-6 cursor-pointer" 
          onClick={() => setSelectedTool(null)}
        >
          <Image src="/images/logo.png" alt="AI Tools Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">AI Tools</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {tools.map((tool) => (
              <li key={tool.id}>
                <button
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedTool?.id === tool.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  {tool.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {selectedTool ? (
          <div>
            <h2 className="text-3xl font-bold mb-4">{selectedTool.name}</h2>
            <p className="text-xl mb-4">{selectedTool.description}</p>
            <selectedTool.component />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-8">Welcome to AI Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold mb-2">{tool.name}</h3>
                  <p className="text-gray-300 mb-4">{tool.description}</p>
                  <Button onClick={() => setSelectedTool(tool)}>Try it out</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PromptPriceCalculator() {
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
      {cost !== null && (
        <div className="mt-4">
          <p className="text-xl">Estimated Cost: ${cost.toFixed(4)}</p>
        </div>
      )}
    </div>
  )
}

function LLMPlayground() {
  return (
    <div className="space-y-4">
      <p>LLM Playground component to be implemented.</p>
    </div>
  )
}

function PromptSaver() {
  return (
    <div className="space-y-4">
      <p>Prompt Saver component to be implemented.</p>
    </div>
  )
}
