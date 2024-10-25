from events.controllgraph.BlockNode import BlockNode


class BlockHolds:
    def __init__(self):
        self.blocks = {}
        self.order = {}
        self.mention_exists = {}
        self.memory = {}

    def add_node(self, order, node_id, node: BlockNode):
        self.order[order] = node_id
        self.blocks[node_id] = node
        self.mention_exists[node_id] = False

    def get_num_blocks(self):
        return len(self.order.keys())
    
    def get_block(self, order_num):
        if order_num in self.order:
            graph_id = self.order[order_num]
            return self.blocks[graph_id]
        return None

    def visualize_node(self, node: BlockNode, depth: int = 0):
        """ Recursively visualize a node and its children. """    
        indent = "    " * depth  # Indent for tree structure
        print(f"{indent}- Node ID: {node.id}, Type: {node.node_type}, Prompt: {node.prompt}")

        for child in node.children:
            self.visualize_node(child, depth + 1)


    def visualize_all(self):
        """ Visualize all nodes in BlockHolds by iterating through the root nodes. """
        print("\nVisualizing BlockHolds...\n")
        for count, node_id in enumerate(self.blocks):
            node = self.blocks[node_id]
            print(f"Block {count + 1}")
            self.visualize_node(node, 0)
            print("\n")

        print("\nVisualization complete.")

    def retrieve_mention(self, blockID, nodeID):
        def find_node(node: BlockNode):
            if nodeID == node.id:
                return node.retrieve_mention()
            
            for child in node.children:
                find_node(child)
            
        if blockID in self.blocks:
            return find_node(self.blocks[blockID])

        return None
