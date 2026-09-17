from pydantic import BaseModel, Field
from typing import List, Optional

class ProductBase(BaseModel):
    title: str
    price: float = 0.0
    category: Optional[str] = "General"
    stream: Optional[str] = "All"
    description: Optional[str] = ""
    type: Optional[str] = "buy"
    seller: Optional[str] = "Anonymous"
    isSold: Optional[bool] = Field(default=False, alias="isSold")
    status: Optional[str] = "AVAILABLE"
    images: Optional[List[str]] = []
    warrantyImages: Optional[List[str]] = Field(default=[], alias="warrantyImages")

    class Config:
        populate_by_name = True
        from_attributes = True

class ProductCreate(ProductBase):
    id: Optional[str] = None

class ProductResponse(ProductBase):
    id: str

class ActivityBase(BaseModel):
    title: str
    meta: Optional[str] = ""
    ts: Optional[str] = None

    class Config:
        from_attributes = True

class ActivityCreate(ActivityBase):
    id: Optional[str] = None

class ActivityResponse(ActivityBase):
    id: str

class UserCreate(BaseModel):
    name: str
    email: str
    college: Optional[str] = None
    collegeId: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    college: Optional[str] = None
    collegeId: Optional[str] = None

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    productId: str
    productTitle: str
    amount: float
    paymentMethod: str
    buyerName: Optional[str] = "Campus Peer"
    buyerEmail: Optional[str] = "peer@college.edu"

class OrderResponse(BaseModel):
    id: str
    productId: str
    productTitle: str
    amount: float
    paymentMethod: str
    buyerName: Optional[str] = None
    buyerEmail: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
