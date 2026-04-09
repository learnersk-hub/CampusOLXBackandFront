
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from app.core.constants import ReservationStatus
from app.schemas.item import ItemResponse


class ReservationCreate(BaseModel):
    item_id: int


class SellerContact(BaseModel):
    name: str
    email: str
    phone: str


class ReservationResponse(BaseModel):
    id: int
    item_id: int
    buyer_id: int
    status: ReservationStatus
    created_at: datetime
    item: Optional[ItemResponse] = None
    seller_contact: Optional[SellerContact] = None

    model_config = ConfigDict(from_attributes=True)
