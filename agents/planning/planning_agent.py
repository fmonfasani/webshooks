from agents import Agent, Runner, tool
import json

@tool
def save_project_plan(data: dict):
    """Guarda el plan generado en la base de datos."""
    from backend.services.planning_service import save_plan
    return save_plan(data)

planning_agent = Agent(
    name="PlanningAgent",
    instructions=(
        "Eres un agente experto en planificación SaaS. "
        "Generas PRDs, backlog inicial y roadmap estructurado. "
        "Devuelve siempre un JSON válido según planning_schema.json."
    ),
    tools=[save_project_plan],
)

async def run_planning(prompt: str):
    result = await Runner.run(planning_agent, prompt)
    return result.final_output
