
from google import genai

client = genai.Client(api_key="AQ.Ab8RN6KmPk9NvHBFi19z0l8RrA_fEvqCgIQiPrZ1k6WnnXLTTg")

# Generic pattern — adjust method names to match your actual SDK
stream = client.interactions.create(
    model="gemini-3.5-flash",
    input="give me exmepls about english",
    
)

for event in stream:
    # exact structure depends on the SDK
    if hasattr(event, "delta"):
        print(event.delta, end="", flush=True)
    else:
        print(event, end="", flush=True)

