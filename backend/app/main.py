from fastapi import FastAPI
from starlette.responses import JSONResponse

from app.routers import family, accounts, income, auth, family_members, transactions, users
from app.db import Base, engine
from fastapi.middleware.cors import CORSMiddleware

from app.utils.errors import InsufficientFundsError

app = FastAPI(title="Family Budget")

@app.exception_handler(InsufficientFundsError)
async def handle_insufficient_funds(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React по умолчанию на 3000 порту
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(family.router)
app.include_router(accounts.router)
app.include_router(income.router)
app.include_router(auth.router)
app.include_router(family_members.router)
app.include_router(transactions.router)
app.include_router(users.router)

