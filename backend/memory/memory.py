from .history import ShortTermMemory


class Memory:
    def __init__(self):
        self.agent_histories = []


    def create_node_history(self):
        mem = ShortTermMemory()
        self.agent_histories.append(mem)


    def add_node_history(self, content, role, command, image=False):
        self.agent_histories[-1].queue_history(content, role, command, image=image)


    def latest_node_history(self):
        return self.agent_histories[-1].get_history()
    
    def get_all_histories(self):
        histories = []
        for agent in self.agent_histories:
            histories.append(agent.get_history())

        return histories
    
    # handle image params
    def markdown_response(self):
        output = ""
        for count, agent in enumerate(self.agent_histories):
            output += "# Agent {}\n\n\n".format(count + 1)
            history = agent.get_history()
            for item in history:
                if item["role"] == "assistant":
                    for content in item["content"]:

                        if content["type"] == "image_url":
                            output += "![generated image]({})".format(content["image_url"]["url"]) + "\n\n"
                        else:
                            output += content["text"] + "\n\n"
        
        return output
                    

    def get_responses(self):
        responses = []
        for history in self.agent_histories:
            responses.append(history.get_latest_response())
        

        return responses

