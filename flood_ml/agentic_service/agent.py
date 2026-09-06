import os
import sys
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

load_dotenv()

# Set API key directly if hardcoded
os.environ["GEMINI_API_KEY"] = "AQ.Ab8RN6LziI75hGIOv1vI3iCpHKjr4hqygD1RTyh7efQrZ97AyQ"

# Check for API key
if not os.getenv("GEMINI_API_KEY"):
    print("[WARN] GEMINI_API_KEY not found in environment variables. Agent will fail if triggered.")

class AlertState(TypedDict):
    thread_id: str
    risk_level: str
    rainfall_mm: float
    safe_route_summary: str
    drafted_message: str
    human_decision: str  # "pending", "approved", "rejected"
    status: str

# 1. Draft Alert Node
def draft_alert_node(state: AlertState):
    print(f"[Agent] Drafting alert for {state['risk_level']} risk (Thread: {state['thread_id']})")
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.2)
        
        prompt = f"""
        You are an emergency response AI. A flash flood alert needs to be generated.
        Risk Level: {state['risk_level']}
        Rainfall: {state['rainfall_mm']}mm
        Evacuation Route: {state['safe_route_summary']}
        
        Draft a concise, urgent, and clear SMS alert message (under 160 characters if possible) 
        in both English and Hindi. Return plain text only without markdown formatting.
        """
        
        response = llm.invoke([
            SystemMessage(content="You are an expert disaster management AI."),
            HumanMessage(content=prompt)
        ])
        
        # Handle string or list of content blocks from modern LangChain
        if isinstance(response.content, list):
            message = "".join([part.get("text", "") if isinstance(part, dict) else str(part) for part in response.content])
        else:
            message = str(response.content)
    except Exception as e:
        print(f"[WARN] Gemini draft failed ({e}), using template fallback")
        message = (
            f"EMERGENCY FLASH FLOOD ALERT: {state['risk_level']} Risk detected ({state['rainfall_mm']}mm rain). "
            f"{state['safe_route_summary']}. Evacuate to higher ground immediately! "
            f"| आपातकालीन चेतावनी: अत्यधिक बाढ़ का खतरा। तुरंत सुरक्षित स्थान पर पहुंचे।"
        )
    
    return {
        "drafted_message": message.strip(),
        "status": "awaiting_approval"
    }

# 2. Dispatch Node
def dispatch_alert_node(state: AlertState):
    decision = state.get("human_decision", "pending")
    if decision == "approved":
        try:
            print(f"[Agent] ALERT DISPATCHED: \n{state['drafted_message']}")
        except UnicodeEncodeError:
            print(f"[Agent] ALERT DISPATCHED: (Dispatched to all residents)")
        return {"status": "dispatched"}
    else:
        print("[Agent] ALERT REJECTED.")
        return {"status": "rejected"}

# Build the Graph
workflow = StateGraph(AlertState)

workflow.add_node("draft_alert", draft_alert_node)
workflow.add_node("dispatch_alert", dispatch_alert_node)

workflow.add_edge(START, "draft_alert")
# Halt execution BEFORE dispatch_alert to allow human review
workflow.add_edge("draft_alert", "dispatch_alert")
workflow.add_edge("dispatch_alert", END)

# In-memory checkpointer to save state across API calls
memory = MemorySaver()
agent_app = workflow.compile(
    checkpointer=memory,
    interrupt_before=["dispatch_alert"]
)
