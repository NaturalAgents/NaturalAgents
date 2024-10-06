class ShortTermMemory:
    def __init__(self):
        self.history = []


    def queue_history(self, content, role, command):
        self.history.append({"content": content, "role": role, "command": command})


    def get_history(self):
        history = self.history
        clean_history = [{"content": i["content"], "role": i["role"]} for i in history]
        return clean_history

    def get_latest_response(self):
        if len(self.history) > 0:
            return self.history[-1]["content"]
        
        return ""