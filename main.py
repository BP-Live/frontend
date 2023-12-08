from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    await websocket.send_json({"status": "pending"})

    await asyncio.sleep(1)

    await websocket.send_json(
        {
            "metadata": {
                "location": "123 Main St, Hometown, HT 12345",
            }
        }
    )

    await asyncio.sleep(1)

    await websocket.send_json(
        {
            "pros": [
                "Offers a wide variety of vegetarian options",
                "Cozy and inviting atmosphere",
                "Uses locally sourced ingredients",
            ]
        }
    )

    await asyncio.sleep(1)

    await websocket.send_json(
        {
            "cons": [
                "Limited parking space",
                "Can be noisy during peak hours",
                "Higher price range",
            ]
        }
    )

    await websocket.send_json({"status": "completed"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
