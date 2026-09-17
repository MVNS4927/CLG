from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import get_db

router = APIRouter(
    prefix="/api/activities",
    tags=["Activities"]
)

@router.get("", response_model=List[dict])
def read_activities(db: Session = Depends(get_db)):
    return crud.get_activities(db)

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_new_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    return crud.create_activity(db=db, activity=activity)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_all_activities(db: Session = Depends(get_db)):
    crud.clear_activities(db)
    return None

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_activity(activity_id: str, db: Session = Depends(get_db)):
    success = crud.delete_activity(db=db, activity_id=activity_id)
    if not success:
        raise HTTPException(status_code=404, detail="Activity not found")
    return None
