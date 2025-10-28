from openai import OpenAI
import os

class PlanningAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def run(self, prompt: str):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a planning assistant helping to break down projects into actionable steps."},
                {"role": "user", "content": prompt},
            ]
        )
        return response.choices[0].message.content
