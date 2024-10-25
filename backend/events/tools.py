from events.PROMPTS import SUMMARY_PROMPT
from litellm import image_generation
from litellm import completion
from dotenv import load_dotenv
import requests
import base64
import os


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
    messages = []
    
    print("history", msg_history)

    # Including all previous history; possibly a better idea to perform RAG for the necessary context?
    for msg in msg_history:
        messages.append(msg)
        if messages[-1]["content"][-1]["type"] == "image_url":
            messages[-1]["role"] = "user" 

    if system:
        messages.append({"content": system, "role": "system"})
    

    messages.append({ "content": prompt,"role": "user"})
    response = completion(model=model, messages=messages)
    return response['choices'][0]['message']['content']



def summarize(requirements=None, model="gpt-4o", history=[]):
    msg_history = history.copy()
    msg_history.append({"content": SUMMARY_PROMPT, "role": "user"})
    response = completion(model=model, messages=msg_history)
    return "\n\n**Summary**\n\n" + response['choices'][0]['message']['content']

    
    
def processPDF(data):
    import fitz

    base64_data = data.split(",", 1)[1]
    pdf_data = base64.b64decode(base64_data)
    if not os.path.exists('/workspace/tmp'):
        os.mkdir('/workspace/tmp')
    
    file_path = '/workspace/tmp/tmp.pdf'
    with open(file_path, "wb") as pdf_file:
        pdf_file.write(pdf_data)


    text = ""
    doc = fitz.open(file_path)
    for page in doc:
        text += page.get_text()

    return text
        




