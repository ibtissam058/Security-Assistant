from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import breach, scanner

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(breach.router)
app.include_router(scanner.router)

@app.get("/health")
def health():
    return {"status": "backend is running"}