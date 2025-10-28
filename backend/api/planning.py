from fastapi import APIRouter, HTTPException
from agents.planning.planning_agent import PlanningAgent

router = APIRouter()
agent = PlanningAgent()

@router.post("/planning")
async def run_planning_agent(prompt: str):
    try:
        result = await agent.run(prompt)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
