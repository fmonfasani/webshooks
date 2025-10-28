#!/bin/bash
# setup_agents.sh
# 🚀 Crea la arquitectura completa de agentes fuera del backend/

BASE_DIR="agents"
CONFIG_DIR="$BASE_DIR/config"
TOOLS_DIR="$BASE_DIR/tools"

echo "🧠 Creando estructura de agentes..."

mkdir -p $BASE_DIR $CONFIG_DIR $TOOLS_DIR
touch $BASE_DIR/__init__.py $CONFIG_DIR/__init__.py $TOOLS_DIR/__init__.py

# Script principal para registrar agentes
cat << 'EOF' > $BASE_DIR/init_agent.py
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
EOF

# Crear agentes individuales
for agent in planning design build integrate test deploy monitor collaborate; do
cat << EOF > $BASE_DIR/${agent}_agent.py
\"\"\"
${agent^} Agent — Lógica del módulo ${agent}.
\"\"\"

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def run_${agent}(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "Sos el agente ${agent} del SaaS Builder."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

if __name__ == "__main__":
    print(run_${agent}("Hola agente ${agent}, cuál es el siguiente paso?"))
EOF
done

# Crear herramientas
cat << 'EOF' > $TOOLS_DIR/project_tools.py
def get_project_summary():
    return {"name": "Demo SaaS Builder", "status": "active", "modules": ["planning", "design", "build"]}
EOF

cat << 'EOF' > $TOOLS_DIR/db_tools.py
def connect_db():
    print("📡 Conectando a la base de datos...")
EOF

cat << 'EOF' > $TOOLS_DIR/chat_tools.py
def send_message(agent_name, message):
    print(f"📨 Enviando mensaje a {agent_name}: {message}")
EOF

echo "✅ Estructura creada en $BASE_DIR"
echo "👉 Ejecutá: python agents/init_agent.py para registrar los agentes"
