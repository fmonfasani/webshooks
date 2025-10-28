#!/bin/bash
# setup_agents.sh
# 🚀 Script para crear la arquitectura completa de agentes en backend/agents/

BASE_DIR="backend/agents"
CONFIG_DIR="$BASE_DIR/config"
TOOLS_DIR="$BASE_DIR/tools"

echo "🧠 Creando estructura de agentes..."

# Carpetas base
mkdir -p $BASE_DIR
mkdir -p $CONFIG_DIR
mkdir -p $TOOLS_DIR

# Archivos de inicialización
echo "" > $BASE_DIR/__init__.py
echo "" > $TOOLS_DIR/__init__.py
echo "" > $CONFIG_DIR/__init__.py

# Archivo de inicialización general de agentes
cat << 'EOF' > $BASE_DIR/init_agent.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def register_agent(name, instructions):
    """Registra un agente en la plataforma de OpenAI y devuelve su workflow_id."""
    print(f"🧩 Registrando agente: {name}")
    agent = client.agents.create(
        name=name,
        model="gpt-4.1-mini",
        instructions=instructions,
        metadata={"type": "module_agent", "project": "webshooks"},
    )
    print(f"✅ Agente {name} registrado con ID: {agent.id}")
    return agent.id

if __name__ == "__main__":
    modules = {
        "planning_agent": "Ayuda al usuario a planificar la arquitectura, features y roadmap del proyecto.",
        "design_agent": "Guía en la selección de UI/UX y componentes visuales.",
        "build_agent": "Asiste en la generación de código, endpoints y bases de datos.",
        "integrate_agent": "Conecta APIs externas, servicios y autenticaciones.",
        "test_agent": "Evalúa el rendimiento, calidad de código y tests.",
        "deploy_agent": "Gestiona la configuración de CI/CD y despliegue en la nube.",
        "monitor_agent": "Supervisa logs, uptime y métricas de uso.",
        "collaborate_agent": "Facilita la comunicación y colaboración entre módulos/agentes."
    }

    os.makedirs("backend/agents/config", exist_ok=True)
    for module, desc in modules.items():
        wid = register_agent(module, desc)
        with open(f"backend/agents/config/{module}.json", "w") as f:
            f.write(f'{{"agent_id": "{wid}"}}')
    print("🎉 Todos los agentes fueron registrados exitosamente.")
EOF

# Crear agentes individuales
for agent in planning design build integrate test deploy monitor collaborate; do
cat << EOF > $BASE_DIR/${agent}_agent.py
"""
${agent^} Agent
=================
Este módulo define la lógica y funciones del agente ${agent}.
"""

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def run_${agent}(prompt: str):
    \"\"\"Ejecuta el agente ${agent} con un prompt dado.\"\"\"
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "Eres un agente del módulo ${agent}, especializado en esta etapa del SaaS Builder."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

if __name__ == "__main__":
    result = run_${agent}("¿Cuál es mi siguiente paso en este módulo?")
    print(f"💬 Respuesta del agente ${agent^}: {result}")
EOF
done

# Crear herramientas comunes
cat << 'EOF' > $TOOLS_DIR/project_tools.py
"""Funciones utilitarias para los agentes."""
def get_project_summary():
    return {
        "name": "Demo SaaS Builder",
        "status": "active",
        "modules": ["planning", "design", "build"]
    }
EOF

cat << 'EOF' > $TOOLS_DIR/db_tools.py
"""Herramientas para acceso a la base de datos."""
def connect_db():
    print("📡 Conectando a la base de datos...")
    # Aquí podrías usar SQLAlchemy o Supabase
EOF

cat << 'EOF' > $TOOLS_DIR/chat_tools.py
"""Herramientas de comunicación entre agentes."""
def send_message(agent_name, message):
    print(f"📨 Enviando mensaje a {agent_name}: {message}")
EOF

echo "✅ Estructura completa creada en $BASE_DIR"
echo "👉 Ejecutá: python backend/agents/init_agent.py para registrar tus agentes en OpenAI"
