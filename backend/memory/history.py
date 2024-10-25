class ShortTermMemory:
    def __init__(self, history=[], indexed_history={}):
        self.history = history
        self.indexed_history = indexed_history


    def queue_history(self, content, role, command, node_id, visible=True, image=False):
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
        new_log = {"content": historical_content, "role": role, "command": command, "visible": visible, "id": node_id}
        self.history.append(new_log)
        if node_id not in self.indexed_history:
            self.indexed_history[node_id] = [new_log]
        else:
            self.indexed_history[node_id].append(new_log)

    def get_history(self, get_vis=False):
        history = self.history
        if get_vis:
            clean_history = [{"content": i["content"], "role": i["role"], "visible": i["visible"]} for i in history]
        else:

            clean_history = [{"content": i["content"], "role": i["role"]} for i in history]
        return clean_history

    def get_latest_response(self):
        if len(self.history) > 0:
            return self.history[-1]["content"]
        
        return ""