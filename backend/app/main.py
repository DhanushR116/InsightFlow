from fastapi import FastAPI


app = FastAPI(title="InsightFlow API")


@app.get("/")
def home():
    return {
        "message": "Welcome to InsightFlow API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "InsightFlow"
    }