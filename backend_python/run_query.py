import sys
import os
from sqlalchemy import text

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import engine

def execute_query(sql_query):
    print(f"\n📊 Running MySQL Query: {sql_query}\n" + "=" * 80)
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql_query))
            if result.returns_rows:
                keys = result.keys()
                header = " | ".join([f"{k:<18}" for k in keys])
                print(header)
                print("-" * len(header))
                rows = result.fetchall()
                for row in rows:
                    print(" | ".join([f"{str(v):<18}" for v in row]))
                print(f"\nTotal rows returned: {len(rows)}\n")
            else:
                conn.commit()
                print("Query executed successfully.")
    except Exception as e:
        print(f"Error executing query: {e}")

if __name__ == "__main__":
    q = sys.argv[1] if len(sys.argv) > 1 else "SELECT id, title, price, seller, stream, is_sold FROM products LIMIT 0, 1000"
    execute_query(q)
