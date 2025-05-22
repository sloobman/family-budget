from fastapi import FastAPI
from app.routers import family, accounts, income
from app.db import Base, engine

app = FastAPI(title="Family Budget")

Base.metadata.create_all(bind=engine)

app.include_router(family.router)
app.include_router(accounts.router)
app.include_router(income.router)