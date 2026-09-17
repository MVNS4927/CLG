import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app import models, schemas

# Product CRUD
def get_products(db: Session):
    products = db.query(models.Product).order_by(models.Product.created_at.desc()).all()
    # Normalize models for response
    results = []
    for p in products:
        results.append({
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "category": p.category,
            "stream": p.stream,
            "description": p.description,
            "type": p.type,
            "seller": p.seller,
            "isSold": bool(p.is_sold),
            "status": p.status or "AVAILABLE",
            "images": p.images or [],
            "warrantyImages": p.warranty_images or []
        })
    return results

def create_product(db: Session, product: schemas.ProductCreate):
    product_id = product.id if product.id else str(uuid.uuid4())
    db_product = models.Product(
        id=product_id,
        title=product.title,
        price=product.price,
        category=product.category,
        stream=product.stream,
        description=product.description,
        type=product.type,
        seller=product.seller,
        is_sold=1 if product.isSold else 0,
        status=product.status or "AVAILABLE",
        images=product.images or [],
        warranty_images=product.warrantyImages or []
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return {
        "id": db_product.id,
        "title": db_product.title,
        "price": db_product.price,
        "category": db_product.category,
        "stream": db_product.stream,
        "description": db_product.description,
        "type": db_product.type,
        "seller": db_product.seller,
        "isSold": bool(db_product.is_sold),
        "status": db_product.status,
        "images": db_product.images or [],
        "warrantyImages": db_product.warranty_images or []
    }

def delete_product(db: Session, product_id: str):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

# Activity CRUD
def get_activities(db: Session):
    activities = db.query(models.Activity).order_by(models.Activity.id.desc()).all()
    return [{"id": a.id, "title": a.title, "meta": a.meta, "ts": a.ts} for a in activities]

def create_activity(db: Session, activity: schemas.ActivityCreate):
    activity_id = activity.id if activity.id else str(uuid.uuid4())
    ts = activity.ts if activity.ts else datetime.utcnow().isoformat()
    db_activity = models.Activity(
        id=activity_id,
        title=activity.title,
        meta=activity.meta,
        ts=ts
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return {"id": db_activity.id, "title": db_activity.title, "meta": db_activity.meta, "ts": db_activity.ts}

def delete_activity(db: Session, activity_id: str):
    db_act = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if db_act:
        db.delete(db_act)
        db.commit()
        return True
    return False

def clear_activities(db: Session):
    db.query(models.Activity).delete()
    db.commit()
    return True

# Order CRUD
def create_order(db: Session, order: schemas.OrderCreate):
    order_id = str(uuid.uuid4())
    db_order = models.Order(
        id=order_id,
        product_id=order.productId,
        product_title=order.productTitle,
        amount=order.amount,
        payment_method=order.paymentMethod,
        buyer_name=order.buyerName,
        buyer_email=order.buyerEmail,
        status="COMPLETED"
    )
    db.add(db_order)

    # Mark product as SOLD in database
    db_product = db.query(models.Product).filter(models.Product.id == order.productId).first()
    if db_product:
        db_product.is_sold = 1
        db_product.status = "SOLD"

    db.commit()
    db.refresh(db_order)

    # Log order activity
    create_activity(db, schemas.ActivityCreate(
        title=f"Order Purchased: {order.productTitle}",
        meta=f"Paid ₹{order.amount} via {order.paymentMethod}"
    ))

    return {
        "id": db_order.id,
        "productId": db_order.product_id,
        "productTitle": db_order.product_title,
        "amount": db_order.amount,
        "paymentMethod": db_order.payment_method,
        "buyerName": db_order.buyer_name,
        "buyerEmail": db_order.buyer_email,
        "status": db_order.status
    }
