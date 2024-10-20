import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Search, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [explanation, setExplanation] = useState('')

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
      setExplanation(data.explanation)
    } catch (error) {
      console.error('Error calculating cost:', error)
    }
  }

  const filteredModels = modelFamilies.map(family => ({
    ...family,
    models: family.models.filter(model => 
      model.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(family => family.models.length > 0)

  return (
    <div className="space-y-8 max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Label htmlFor="model-select" className="block text-lg font-medium text-gray-100 mb-2">
            Select a model
          </Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model-select" className="w-full bg-gray-800 text-gray-100">
              <SelectValue placeholder="Choose a model" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-gray-100">
              <div className="flex items-center px-2 sticky top-0 bg-gray-800">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input 
                  placeholder="Search models..." 
                  className="h-8 w-full bg-transparent border-none focus:ring-0 text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {filteredModels.map((family) => (
                <SelectGroup key={family.name}>
                  <SelectLabel className="text-gray-300">{family.name}</SelectLabel>
                  {family.models.map((model) => (
                    <SelectItem key={model} value={model} className="text-gray-100">{model}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="request-count" className="block text-lg font-medium text-gray-100 mb-2">
            Number of requests
          </Label>
          <div className="flex space-x-4">
            <Input
              id="request-count"
              type="number"
              placeholder="Enter number"
              value={requestCount}
              onChange={(e) => setRequestCount(e.target.value)}
              className="flex-grow bg-gray-800 text-gray-100"
            />
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-1/2 bg-gray-800 text-gray-100">
                <SelectValue placeholder="Time frame" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-gray-100">
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="week">Per Week</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="input-prompt" className="block text-lg font-medium text-gray-100 mb-2">
            Input Prompt
          </Label>
          <Textarea
            id="input-prompt"
            placeholder="Enter your prompt here"
            value={inputText}
            onChange={handleInputChange}
            className="min-h-[150px] bg-gray-800 text-gray-100"
          />
          <p className="text-sm text-gray-300 mt-1">Word count: {inputWordCount}</p>
        </div>
        <div>
          <Label htmlFor="output-example" className="block text-lg font-medium text-gray-100 mb-2">
            Example Output
          </Label>
          <Textarea
            id="output-example"
            placeholder="Example of model output"
            value={outputText}
            onChange={handleOutputChange}
            className="min-h-[150px] bg-gray-800 text-gray-100"
          />
          <p className="text-sm text-gray-300 mt-1">Word count: {outputWordCount}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
          Calculate Cost
        </Button>
      </div>

      {cost !== null && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-100">Cost Estimation</h3>
          <div className="flex items-center space-x-2 mb-4">
            <p className="text-2xl font-semibold text-green-400">
              ${cost.toFixed(4)} 
            </p>
            <span className="text-gray-300">per {costTimeFrame}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-700 text-gray-100">
                  <p>{explanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={costTimeFrame} onValueChange={setCostTimeFrame}>
            <SelectTrigger className="w-full max-w-xs bg-gray-700 text-gray-100">
              <SelectValue placeholder="Select cost time frame" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-100">
              <SelectItem value="request">Per Request</SelectItem>
              <SelectItem value="day">Per Day</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
              <SelectItem value="year">Per Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
