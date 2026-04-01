from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.core.constants import ItemStatus


from app.schemas.user import UserPublic


class ItemBase(BaseModel):
    title: str
    description: str
    price: int
    pickup_location: str
    available_till: datetime
    category_id: int


class ItemCreate(ItemBase):
    pass


class ItemResponse(ItemBase):
    id: int
    status: ItemStatus
    seller_id: int
    seller: UserPublic
    image_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

