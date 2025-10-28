from fastapi import APIRouter, HTTPException
import importlib
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter(prefix="/api/agents", tags=["Agents"])

@router.post("/{agent_name}/run")
async def run_agent(agent_name: str, prompt: str):
    """
    Ejecuta un agente (por ejemplo: planning, build, deploy, etc.)
    """
    try:
        module_name = f"agents.{agent_name}_agent"
        agent_module = importlib.import_module(module_name)
        func_name = f"run_{agent_name}"
        if not hasattr(agent_module, func_name):
            raise HTTPException(status_code=404, detail="Agente no encontrado.")
        result = getattr(agent_module, func_name)(prompt)
        return {"agent": agent_name, "response": result}
    except ModuleNotFoundError:
        raise HTTPException(status_code=404, detail="Módulo de agente no existe.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
