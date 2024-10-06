from .history import ShortTermMemory


class Memory:
    def __init__(self):
        self.agent_histories = []


    def create_node_history(self):
        mem = ShortTermMemory()
        self.agent_histories.append(mem)


    def add_node_history(self, content, role, command):
        self.agent_histories[-1].queue_history(content, role, command)


    def latest_node_history(self):
        return self.agent_histories[-1].get_history()
    
    def get_all_histories(self):
        histories = []
        for agent in self.agent_histories:
            histories.append(agent.get_history())

        return histories

    def get_responses(self):
        responses = []
        for history in self.agent_histories:
            responses.append(history.get_latest_response())
        

        return responses

