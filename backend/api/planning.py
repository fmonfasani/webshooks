from fastapi import APIRouter
from agents.planning.planning_agent import run_planning

router = APIRouter(prefix="/api/planning", tags=["Planning"])

@router.post("/")
async def generate_plan(payload: dict):
    """Genera el plan de proyecto con el agente Planning."""
    result = await run_planning(payload.get("instruction", "Create a SaaS plan"))
    return {"plan": result}
