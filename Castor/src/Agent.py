from vertexai.generative_models import GenerativeModel, GenerationConfig

class Agent:
    def __init__(self, model_name, role, tools):
        self.model = GenerativeModel(
            model_name,
            generation_config=GenerationConfig(temperature=0.5),
        )
        self.role = role
        self.tools = tools


class Castor:
    def __init__(self):
        self.agents = []

    def add_agent(self, agent):
        self.agents.append(agent)

    def process(self, input_data):
        results = []
        for agent in self.agents:
            result = agent.process_webpage(input_data)
            results.append(result)
        return results
