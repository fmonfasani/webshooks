import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def register_agent(name, instructions):
    print(f"🧩 Registrando agente: {name}")
    agent = client.agents.create(
        name=name,
        model="gpt-4.1-mini",
        instructions=instructions,
        metadata={"type": "module_agent", "project": "webshooks"}
    )
    print(f"✅ Agente {name} registrado con ID: {agent.id}")
    return agent.id

if __name__ == "__main__":
    modules = {
        "planning_agent": "Ayuda a planificar arquitectura, features y roadmap.",
        "design_agent": "Guía el diseño UI/UX.",
        "build_agent": "Genera código y bases de datos.",
        "integrate_agent": "Conecta APIs y servicios externos.",
        "test_agent": "Ejecuta evaluaciones de calidad y rendimiento.",
        "deploy_agent": "Gestiona despliegues y CI/CD.",
        "monitor_agent": "Monitorea logs y métricas.",
        "collaborate_agent": "Orquesta colaboración entre agentes."
    }

    os.makedirs("agents/config", exist_ok=True)
    for name, desc in modules.items():
        wid = register_agent(name, desc)
        with open(f"agents/config/{name}.json", "w") as f:
            f.write(f'{{"agent_id": "{wid}"}}')
    print("🎉 Todos los agentes fueron registrados exitosamente.")
