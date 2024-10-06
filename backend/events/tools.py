from litellm import image_generation
from litellm import completion
from dotenv import load_dotenv
import requests
import base64


load_dotenv("/workspace/.env")


def generate_image(prompt, model='dall-e-2'):
    response = image_generation(model=model, prompt=prompt)
    url = response["data"][0]['url']

    response = requests.get(url)
    if response.status_code == 200:
        base64_image = base64.b64encode(response.content).decode('utf-8')
        return base64_image

    return "Failed to generate image"


def text_generate(prompt, system=None, model="gpt-4o", history=[]):
    messages = history
    if system:
        messages.append({"content": system, "role": "system"})
    messages.append({ "content": prompt,"role": "user"})

    response = completion(model=model, messages=messages)
    return response['choices'][0]['message']['content']

