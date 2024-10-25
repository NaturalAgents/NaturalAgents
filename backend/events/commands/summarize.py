from events.commands.generate import Generate
from events.PROMPTS import SUMMARY_PROMPT


class Summarize(Generate):
    def __init__(self, ws, node):
        super().__init__(ws, node)
    
    
    async def process(self):
        node = self.node
        history = node.memory.get_history()
        self.input = SUMMARY_PROMPT
        response = self.text_generate(SUMMARY_PROMPT, history=history)
        self.output = response
        node.memory.queue_history(SUMMARY_PROMPT, "user", node.node_type, node.id, visible=node.vis)
        node.memory.queue_history(response, "assistant", node.node_type, node.id, visible=node.vis)

        if node.vis:
            await self.emit()