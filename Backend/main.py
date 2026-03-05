import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import requests
from dotenv import load_dotenv
import urllib3

# Suppress insecure request warnings from verify=False
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="NASA APOD API Viewer")

# Allow requests from any origin (useful during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NASA_API_KEY = os.getenv("NASA_API_KEY", "DEMO_KEY")
NASA_API_URL = "https://api.nasa.gov/planetary/apod"

@app.get("/api/apod")
def get_apod(date: str = None):
    print(f"DEBUG: Received request for /api/apod with date={date}")
    try:
        params = {"api_key": NASA_API_KEY}
        if date:
            params["date"] = date
            
        print(f"DEBUG: Fetching from NASA: {NASA_API_URL} with params={params}")
        # Disable SSL verification due to potential local network/proxy certificate issues
        response = requests.get(NASA_API_URL, params=params, verify=False, timeout=10)
        print(f"DEBUG: NASA Response Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"DEBUG: NASA Error Body: {response.text}")
            try:
                error_data = response.json()
                error_msg = error_data.get("msg", error_data.get("error", {}).get("message", "NASA API Error"))
            except:
                error_msg = response.text or "Error without message from NASA"
            raise HTTPException(status_code=response.status_code, detail=error_msg)
            
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"DEBUG: Request Exception: {e}")
        raise HTTPException(status_code=500, detail=f"Erro de conexão com a NASA: {str(e)}")
    except Exception as e:
        print(f"DEBUG: Unexpected Exception: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Find the Frontend directory relatively from this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "Frontend")

# Create Frontend folder if it doesn't exist
os.makedirs(FRONTEND_DIR, exist_ok=True)

# Mount the static files so that exploring to "/" returns the Frontend's index.html
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
