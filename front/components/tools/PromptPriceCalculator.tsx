import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Search } from 'lucide-react'

const modelFamilies = [
  {
    name: 'Sonnet',
    models: ['Sonnet-1', 'Sonnet-2', 'Sonnet-3']
  },
  {
    name: 'Gemini',
    models: ['Gemini-1', 'Gemini-2', 'Gemini-3']
  },
  {
    name: 'OpenAI',
    models: ['GPT-3.5', 'GPT-4', 'GPT-4 Turbo', 'DALL-E 3']
  }
]

export default function PromptPriceCalculator() {
  const [model, setModel] = useState('')
  const [inputText, setInputText] = useState('')
  const [inputWordCount, setInputWordCount] = useState(0)
  const [outputText, setOutputText] = useState('')
  const [outputWordCount, setOutputWordCount] = useState(0)
  const [requestCount, setRequestCount] = useState('')
  const [timeFrame, setTimeFrame] = useState('day')
  const [cost, setCost] = useState<number | null>(null)
  const [costTimeFrame, setCostTimeFrame] = useState('request')

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    setInputWordCount(e.target.value.trim().split(/\s+/).length)
  }

  const handleOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputText(e.target.value)
    setOutputWordCount(e.target.value.trim().split(/\s+/).length)
  }

  const handleCalculate = async () => {
    try {
      const response = await fetch('/api/calculate-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model, 
          inputWordCount, 
          outputWordCount, 
          requestCount: parseInt(requestCount), 
          timeFrame 
        }),
      })
      const data = await response.json()
      setCost(data.cost)
    } catch (error) {
      console.error('Error calculating cost:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="w-1/3">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <div className="flex items-center px-2 sticky top-0 bg-white">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input placeholder="Search models..." className="h-8 w-full" />
              </div>
              {modelFamilies.map((family) => (
                <SelectGroup key={family.name}>
                  <SelectLabel>{family.name}</SelectLabel>
                  {family.models.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-2/3">
          <Textarea
            placeholder="Enter your prompt here"
            value={inputText}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-400 mt-1">Word count: {inputWordCount}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-2/3">
          <Textarea
            placeholder="Example of model output"
            value={outputText}
            onChange={handleOutputChange}
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-400 mt-1">Word count: {outputWordCount}</p>
        </div>
        <div className="w-1/3 space-y-4">
          <Input
            type="number"
            placeholder="Number of requests"
            value={requestCount}
            onChange={(e) => setRequestCount(e.target.value)}
          />
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger>
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Per Day</SelectItem>
              <SelectItem value="week">Per Week</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCalculate} className="w-full">Calculate Cost</Button>
        </div>
      </div>
      {cost !== null && (
        <div className="bg-green-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Cost Estimation</h3>
          <p>Estimated Cost: ${cost.toFixed(4)} per {costTimeFrame}</p>
          <Select value={costTimeFrame} onValueChange={setCostTimeFrame} className="mt-2">
            <SelectTrigger>
              <SelectValue placeholder="Select cost time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="request">Per Request</SelectItem>
              <SelectItem value="day">Per Day</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
              <SelectItem value="year">Per Year</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-2">
            This cost is calculated based on the selected model, input and output word counts, 
            and the number of requests over the specified time frame.
          </p>
        </div>
      )}
    </div>
  )
}
