import sys
import os
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import engine

def migrate():
    print("🔄 Running PostgreSQL Schema Migration...")
    queries = [
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS seller VARCHAR(100);",
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS is_sold INT DEFAULT 0;",
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'AVAILABLE';",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_title VARCHAR(255);",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(100);",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_email VARCHAR(150);",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;"
    ]
    with engine.connect() as conn:
        for q in queries:
            try:
                conn.execute(text(q))
                conn.commit()
                print(f"✅ Executed: {q}")
            except Exception as e:
                print(f"ℹ️ {q} -> {e}")

if __name__ == "__main__":
    migrate()
