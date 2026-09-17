import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Text, JSON, DateTime, Integer, ForeignKey
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False, default=0.0)
    category = Column(String(100), nullable=True)
    stream = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    type = Column(String(50), nullable=False, default="buy")  # 'buy' or 'rent'
    seller = Column(String(100), nullable=True)
    is_sold = Column(Integer, default=0)
    status = Column(String(50), default="AVAILABLE")
    images = Column(JSON, nullable=True, default=list)
    warranty_images = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    meta = Column(String(255), nullable=True)
    ts = Column(String(100), default=lambda: datetime.utcnow().isoformat())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    college = Column(String(150), nullable=True)
    college_id = Column(String(100), nullable=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), nullable=False)
    product_title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False)
    buyer_name = Column(String(100), nullable=True)
    buyer_email = Column(String(150), nullable=True)
    status = Column(String(50), default="COMPLETED")
    created_at = Column(DateTime, default=datetime.utcnow)
