import asyncio
from src.config import Config
from src.db.main import get_session
from src.auth.service import UserService
from src.auth.schemas import UserCreateModel  # Đảm bảo đường dẫn đúng
from sqlmodel.ext.asyncio.session import AsyncSession


async def create_admin():
    async for session in get_session():
        user_service = UserService()

        admin_email = Config.ADMIN_EMAIL
        admin_password = Config.ADMIN_PASSWORD

        existing_admin = await user_service.get_user_by_email(admin_email, session)

        if not existing_admin:
            admin_data = UserCreateModel(
                first_name="Admin",
                last_name="User",
                username="admin01",
                email=admin_email,
                password=admin_password,
            )
            new_admin = await user_service.create_user(admin_data, session)
            new_admin.role = "admin"
            new_admin.is_verified = True

            session.add(new_admin)
            await session.commit()
            print("✅ Admin user created.")
        else:
            print("ℹ️ Admin user already exists.")


if __name__ == "__main__":
    asyncio.run(create_admin())
