class ShortTermMemory:
    def __init__(self):
        self.history = []


    def queue_history(self, content, role, command, image=False):
        historical_content = []
        
        if image:
            content_info = {"type": "image_url",
                            "image_url": {
                                "url": content
                                }
                            }
        else:
            content_info = {
                "type": "text",
                "text": content
            }
        historical_content.append(content_info)


        self.history.append({"content": historical_content, "role": role, "command": command})


    def get_history(self):
        history = self.history
        clean_history = [{"content": i["content"], "role": i["role"]} for i in history]
        return clean_history

    def get_latest_response(self):
        if len(self.history) > 0:
            return self.history[-1]["content"]
        
        return ""