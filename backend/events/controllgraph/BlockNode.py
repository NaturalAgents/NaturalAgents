from memory.history import ShortTermMemory


class BlockNode:
    def __init__(self, id: str, node_type: str, prompt: str = None, file_type: str = None, vis: bool = False):
        self.id = id
        self.node_type = node_type  # type of the node (e.g., <command>:generate)
        self.prompt = prompt  # prompt text for certain types of nodes
        self.file_type = file_type  # fileType for file nodes
        self.vis = vis  # visibility
        self.children = []
        self.mention = None
        self.incoming = []
        self.memory = None
        self.processor = None

    def add_child(self, child: 'BlockNode'):
        self.children.append(child)


    def add_mention(self, graph_id: str, node_id: str):
        if self.node_type == "mention":
            self.mention = (graph_id, node_id)


    def initialize_memory(self, history=[], indexed_history={}):
        self.memory = ShortTermMemory(history=history, indexed_history=indexed_history)


    def retrieve_mention(self, nodeID):
        if nodeID in self.memory.indexed_history:
            return self.memory.indexed_history[nodeID]

        return None