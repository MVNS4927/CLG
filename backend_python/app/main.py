import os
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import products, activities, orders

# Auto-create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="College Space API (Python Backend)",
    description="Python FastAPI Backend replacing Spring Boot Java Backend for CLG Space Marketplace",
    version="1.0.0"
)

# Ensure upload directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static uploads directory so images are publicly accessible via HTTP URL
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Configure CORS so Vite React frontend (port 5173) can access endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(products.router)
app.include_router(activities.router)
app.include_router(orders.router)

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload product images to backend server storage & return public URL."""
    file_ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    return {"url": f"http://localhost:8080/uploads/{filename}"}

@app.post("/api/upload-drive")
async def upload_image_to_drive(file: UploadFile = File(...)):
    """
    Google Drive Upload Integration Endpoint:
    Uploads file to server upload directory and generates direct accessible view URL.
    Can be hooked with Google Drive Service Account API (google-api-python-client).
    """
    file_ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"drive_{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    return {
        "status": "success",
        "url": f"http://localhost:8080/uploads/{filename}",
        "drive_file_id": filename,
        "message": "File successfully uploaded and stored for public viewing."
    }

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "College Space Python Backend API",
        "docs_url": "http://localhost:8080/docs"
    }
