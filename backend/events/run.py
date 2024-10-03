import json
from litellm import completion
from dotenv import load_dotenv, dotenv_values

load_dotenv("/workspace/.env")
config = dotenv_values("/workspace/.env")
print(config)


def processPayload(payload):
    obj = json.loads(payload)    
    bubbles = find_vertical_bubbles(obj)

    responses = []
    for bubble in bubbles:
        response = run_api(bubble)
    
    responses.append(response)
    return responses


def run_api(prompt, system=None, model="gpt-4o"):
    messages = []
    if system:
        messages.append({"content": system, "role": "system"})
    messages.append({ "content": prompt,"role": "user"})

    response = completion(model=model, messages=messages)
    return response['choices'][0]['message']['content']



def find_vertical_bubbles(editor_content):
    vertical_bubbles = []
    def search_bubbles(content):
        for item in content:
            if item['type'] == 'bubble':
                vertical_bubbles.append(item["content"][0]["text"])
            if 'children' in item and item['children']:
                search_bubbles(item['children'])

    search_bubbles(editor_content)
    
    return vertical_bubbles


