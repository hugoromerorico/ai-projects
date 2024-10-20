import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Search, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

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
  const [useEstimation, setUseEstimation] = useState(false)
  const [estimatedOutputWords, setEstimatedOutputWords] = useState('')

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
          outputWordCount: useEstimation ? parseInt(estimatedOutputWords) : outputWordCount, 
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
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Prompt Price Calculator</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700 rounded-lg">
            <CardHeader>
              <CardTitle>Input Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model-select" className="mb-2">Select a model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger id="model-select" className="w-full bg-gray-700 rounded-md">
                      <SelectValue placeholder="Choose a model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 rounded-md">
                      <div className="flex items-center px-2 sticky top-0 bg-gray-700">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input 
                          placeholder="Search models..." 
                          className="h-8 w-full bg-transparent border-none focus:ring-0"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {filteredModels.map((family) => (
                        <SelectGroup key={family.name}>
                          <SelectLabel className="text-gray-400">{family.name}</SelectLabel>
                          {family.models.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="request-count" className="mb-2">Number of requests</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="request-count"
                      type="number"
                      placeholder="Enter number"
                      value={requestCount}
                      onChange={(e) => setRequestCount(e.target.value)}
                      className="flex-grow bg-gray-700 rounded-md"
                    />
                    <Select value={timeFrame} onValueChange={setTimeFrame}>
                      <SelectTrigger className="w-1/2 bg-gray-700 rounded-md">
                        <SelectValue placeholder="Time frame" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 rounded-md">
                        <SelectItem value="day">Per Day</SelectItem>
                        <SelectItem value="week">Per Week</SelectItem>
                        <SelectItem value="month">Per Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="input-prompt" className="mb-2">Input Prompt</Label>
                <Textarea
                  id="input-prompt"
                  placeholder="Enter your prompt here"
                  value={inputText}
                  onChange={handleInputChange}
                  className="min-h-[100px] bg-gray-700 rounded-md"
                />
                <p className="text-sm text-gray-400 mt-1">Word count: {inputWordCount}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={useEstimation}
                  onCheckedChange={setUseEstimation}
                  id="use-estimation"
                />
                <Label htmlFor="use-estimation">Use word count estimation for output</Label>
              </div>
              {useEstimation ? (
                <div>
                  <Label htmlFor="estimated-output" className="mb-2">Estimated Output Word Count</Label>
                  <Input
                    id="estimated-output"
                    type="number"
                    placeholder="Enter estimated word count"
                    value={estimatedOutputWords}
                    onChange={(e) => setEstimatedOutputWords(e.target.value)}
                    className="w-full bg-gray-700 rounded-md"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="output-example" className="mb-2">Example Output</Label>
                  <Textarea
                    id="output-example"
                    placeholder="Example of model output"
                    value={outputText}
                    onChange={handleOutputChange}
                    className="min-h-[100px] bg-gray-700 rounded-md"
                  />
                  <p className="text-sm text-gray-400 mt-1">Word count: {outputWordCount}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} size="lg" className="w-full bg-blue-600 hover:bg-blue-700 rounded-md">
                Calculate Cost
              </Button>
            </CardFooter>
          </Card>
          <Card className="bg-gray-800 border-gray-700 rounded-lg">
            <CardHeader>
              <CardTitle>Cost Estimation</CardTitle>
            </CardHeader>
            <CardContent>
              {cost !== null ? (
                <>
                  <div className="flex items-center space-x-2 mb-4">
                    <p className="text-3xl font-semibold text-green-400">
                      ${cost.toFixed(4)} 
                    </p>
                    <span className="text-gray-300">per {costTimeFrame}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-5 w-5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-700 max-w-md rounded-md">
                          <p>{explanation}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={costTimeFrame} onValueChange={setCostTimeFrame}>
                    <SelectTrigger className="w-full bg-gray-700 rounded-md">
                      <SelectValue placeholder="Select cost time frame" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 rounded-md">
                      <SelectItem value="request">Per Request</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                      <SelectItem value="year">Per Year</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <p className="text-gray-400 text-center">Calculate the cost to see the estimation here</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
