# Integrate Agent — Lógica del módulo integrate.


from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def run_integrate(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "Sos el agente integrate del SaaS Builder."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

if __name__ == "__main__":
    print(run_integrate("Hola agente integrate, cuál es el siguiente paso?"))
