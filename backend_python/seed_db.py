import uuid
from app.database import SessionLocal, engine, Base
from app import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if products already exist
    existing_count = db.query(models.Product).count()
    if existing_count > 0:
        print(f"Database already populated with {existing_count} products.")
        db.close()
        return

    print("🌱 Seeding PostgreSQL database with initial campus marketplace listings...")

    initial_products = [
        models.Product(
            id=str(uuid.uuid4()),
            title="Casio FX-991EX Scientific Calculator",
            price=850.0,
            category="Calculators",
            stream="Engineering",
            description="Mint condition non-programmable scientific calculator approved for semester exams. Solar powered.",
            type="buy",
            seller="Rahul Sharma (CSE-3rd Year)",
            images=["https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80"],
            warranty_images=[]
        ),
        models.Product(
            id=str(uuid.uuid4()),
            title="Arduino Uno Ultimate Starter Kit",
            price=1200.0,
            category="Electronics",
            stream="ECE",
            description="Complete kit with sensors, breadboard, LCD display, jumper wires, and motors. Perfect for lab projects.",
            type="buy",
            seller="Priya Verma (ECE-4th Year)",
            images=["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80"],
            warranty_images=[]
        ),
        models.Product(
            id=str(uuid.uuid4()),
            title="Medical Lab Coat & Stethoscope",
            price=150.0,
            category="Lab Equipment",
            stream="Medical",
            description="Clean white cotton lab coat (Size M) along with standard Littmann stethoscope for daily clinical rotations.",
            type="rent",
            seller="Dr. Ananya Roy (MBBS-2nd Year)",
            images=["https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=600&auto=format&fit=crop&q=80"],
            warranty_images=[]
        ),
        models.Product(
            id=str(uuid.uuid4()),
            title="Engineering Graphics Drawing Board & T-Square",
            price=450.0,
            category="Drawing Kits",
            stream="Mechanical",
            description="Standard wooden drawing board with acrylic T-Square and set-squares for 1st year EG lab.",
            type="buy",
            seller="Vikram Singh (ME-2nd Year)",
            images=["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80"],
            warranty_images=[]
        ),
    ]

    initial_activities = [
        models.Activity(
            id=str(uuid.uuid4()),
            title="Welcome to CLG Space Marketplace",
            meta="Python FastAPI & PostgreSQL Backend Connected"
        ),
        models.Activity(
            id=str(uuid.uuid4()),
            title="System Initialization",
            meta="Seeded initial campus marketplace items"
        )
    ]

    db.add_all(initial_products)
    db.add_all(initial_activities)
    db.commit()
    db.close()
    print("✅ PostgreSQL database successfully seeded!")

if __name__ == "__main__":
    seed_database()
