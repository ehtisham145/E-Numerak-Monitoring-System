from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.utils.config import DATABASE_URL, DEBUG

class Base(DeclarativeBase):
    pass

#----------------Create Data Base Engine-----------------
"""When we set echo to true then on backend we will also see sql queries in terminal"""
db_url = DATABASE_URL or "sqlite+aiosqlite:///./monitoring.db"

engine = create_async_engine(
    db_url,
    echo=DEBUG
)

#-------------Create Session in Data Base---------------------
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

#--------Create Table in Database----------------------------------
async def create_tables():
    """engine.connect is used when we want to connect with db manually"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

#-------Get Database Session----------------------------------------
async def get_db():
    """Here in this Endpoint we are assigning a session to user and once user has done we will save changes
    in database"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()