import uvicorn
from seed_db import seed_database

if __name__ == "__main__":
    print("🐘 Initializing PostgreSQL database tables and seed data...")
    try:
        seed_database()
    except Exception as e:
        print(f"⚠️ Note during seeding: {e}")

    print("🚀 Starting College Space Python Backend on http://localhost:8080...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
