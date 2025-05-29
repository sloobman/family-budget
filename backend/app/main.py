from fastapi import FastAPI
from starlette.responses import JSONResponse

from app.routers import family, accounts, income, auth, family_members, transactions, users, categories
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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(family.router, prefix="/api")
app.include_router(accounts.router, prefix="/api")
app.include_router(income.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(family_members.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(categories.router, prefix="/api")

