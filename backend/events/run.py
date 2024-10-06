import json
from memory.memory import Memory
from events.tools import generate_image, text_generate


memory = Memory()

ACTION_TYPES = {"<command>:generate", "<command>:image_generation"}

# TODO: handle the history with image params
def processPayload(payload):
    obj = json.loads(payload)    
    bubbles_blocks = find_vertical_bubbles(obj)

    for block in bubbles_blocks:
        memory.create_node_history()
        for item in block:
            image = False
            memory.add_node_history(item[1], "user", item[0])

            chat_history = memory.latest_node_history()

            if item[0] == "<command>:generate":
                response = text_generate(item[1], history=chat_history)

            elif item[0] == "<command>:image_generation":
                response = generate_image(item[1])
                image = True
            else:
                response = "command is not supported"

            memory.add_node_history(response, "assistant", item[0], image=image)

    output = memory.markdown_response()
    return output



def find_vertical_bubbles(editor_content):
    vertical_bubbles = []

    def search_bubbles(content):
        current_chain = []

        for item in content:
            if item['type'] == 'bubble':
                current_chain.append((item["props"]["text"], item["content"][0]["text"]))
                
                if 'children' in item and item['children']:
                    child_bubbles = search_bubbles(item['children'])
                    current_chain.extend(child_bubbles)

        return current_chain

    for item in editor_content:
        if item['type'] == 'bubble':
            chain = [(item["props"]["text"], item["content"][0]["text"])]
            if 'children' in item and item['children']:
                child_bubbles = search_bubbles(item['children'])
                chain.extend(child_bubbles)
            vertical_bubbles.append(chain)

    return vertical_bubbles


if __name__ == "__main__":
    json_data = [
    {
        "id": "91d0f522-fa6b-4a8c-84aa-e5a8858394e5",
        "type": "bubble",
        "props": {"text": "<command>:image_generation", "color": "green"},
        "content": [{"type": "text", "text": "Create an image of a fox breathing fire", "styles": {}}],
        "children": [
            {
                "id": "cdd32dc7-afed-4cab-91e9-5af12af13a8c",
                "type": "bubble",
                "props": {"text": "<command>:generate", "color": "blue"},
                "content": [{"type": "text", "text": "Write a description of the image above", "styles": {}}],
                "children": []
            }
        ]
    },
    {
        "id": "c458173e-1262-479b-ad48-5be21b74f092",
        "type": "bubble",
        "props": {"text": "<command>:another_action", "color": "red"},
        "content": [{"type": "text", "text": "Perform another action", "styles": {}}],
        "children": []
    }
]


    bubbles = find_vertical_bubbles(json_data)
    print(bubbles)
