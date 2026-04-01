import asyncio
import sys
from sqlalchemy import select, update
from app.db.session import SessionLocal
from app.models.user import User
from app.core.constants import UserRole

async def promote_to_admin(email: str):
    async with SessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"Error: User with email '{email}' not found.")
            return

        if user.role == UserRole.ADMIN:
            print(f"User '{email}' is already an admin.")
            return

        await db.execute(
            update(User)
            .where(User.id == user.id)
            .values(role=UserRole.ADMIN)
        )
        await db.commit()
        print(f"Success: User '{email}' has been promoted to ADMIN.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
    else:
        email = sys.argv[1]
        asyncio.run(promote_to_admin(email))
