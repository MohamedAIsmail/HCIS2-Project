from fastapi import FastAPI, File, UploadFile
from model import *
from fastapi.responses import StreamingResponse
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware


model = load_model("maskrcnn_resnet50_fpn.pth")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
@app.post("/segment")
async def segment(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    masked_image = pridect(model, image)
    return StreamingResponse(masked_image, media_type="image/png")


