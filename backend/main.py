from fastapi import FastAPI
from database import engine,Base
import models
from routes import router
from auth import hash_password,verify_password
from fastapi.middleware.cors import CORSMiddleware

#fast api object
app = FastAPI(title="Authentication Module (Sign-up & Sign-in)",
              description="This is a simple Authentication Module task given by Mediatize")

# configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# creating database tables
Base.metadata.create_all(bind=engine)

# Take all the routes inside this router and add them to my application
app.include_router(router)

# homepage api
@app.get("/",tags=["Home Page"])
def home_page():
    return {"message":"Welcome to Authentication Module Provided by Mediatize."}

# db connection checking api
@app.get("/dbconnect",tags=["Check DB connection"])
def home():
    try:
        with engine.connect() as connection:
            return {"message": "PostgreSQL connected successfully"}
    except Exception as e:
        return {"error": str(e)}
    
# Verifing Encrypted Password
@app.get("/verify_pass",tags=["Verify Encrypt Password"])
def home():
    password = "Dileep@123"

    hashed = hash_password(password)

    return {
        "password": password,
        "hashed_password": hashed,
        "verified": verify_password(password, hashed)
    }