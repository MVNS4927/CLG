import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL connection used by the local pgAdmin/PostgreSQL 18 instance.
# SQLAlchemy accepts the PostgreSQL database name with its space here.
DEFAULT_POSTGRES_URL = "postgresql+psycopg2://postgres:@localhost:5433/CLG SPACE"

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_POSTGRES_URL)

try:
    connect_args = {"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args=connect_args,
        pool_pre_ping=True
    )
    # Test connection
    with engine.connect() as connection:
        print(f"🚀 Connected to database successfully via {SQLALCHEMY_DATABASE_URL.split('://')[0]}")
except Exception as err:
    print(f"⚠️ Failed connecting to primary database: {err}")
    print("🔄 Falling back to embedded SQLite database (sqlite:///./collegespace.db)...")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./collegespace.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
