import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to AI Projects</h1>
      <p className="text-xl">
        Explore various AI tools and experiments. This website showcases personal projects related to artificial intelligence.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolCard
          title="Prompt Price Calculator"
          description="Calculate the cost of your AI prompts"
          link="/prompt-price"
        />
        <ToolCard
          title="LLM Playground"
          description="Try out different Language Models"
          link="/llm-playground"
        />
        <ToolCard
          title="Prompt Saver"
          description="Save and organize your AI prompts"
          link="/prompt-saver"
        />
      </div>
    </div>
  )
}

function ToolCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300 mb-4">{description}</p>
      <Link href={link} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Try it out
      </Link>
    </div>
  )
}
