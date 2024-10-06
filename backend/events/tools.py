from litellm import image_generation
from litellm import completion
from dotenv import load_dotenv
import requests
import base64


load_dotenv("/workspace/.env")


def generate_image(prompt, model='dall-e-2'):
    response = image_generation(model=model, prompt=prompt)
    url = response["data"][0]['url']

    # response = requests.get(url)
    # if response.status_code == 200:
    #     base64_image = base64.b64encode(response.content).decode('utf-8')
    #     return base64_image

    # return "Failed to generate image"
    return url


def text_generate(prompt, system=None, model="gpt-4o", history=[]):
    msg_history = history.copy()
  
    print(msg_history)
    messages = []

    if system:
        messages.append({"content": system, "role": "system"})


    if len(msg_history) == 1:
        messages.append(msg_history[0])
    
    if len(msg_history) > 1:
        context = msg_history[-2].copy()
        if context["role"] == "assistant":
            context["role"] = "user"
        
        messages.append(context)
        messages.append(msg_history[-1])
 
    print("model inputs", messages)
    
    # messages.append({ "content": [{"type": "text", "text": prompt}],"role": "user"})

    response = completion(model=model, messages=messages)
    return response['choices'][0]['message']['content']

