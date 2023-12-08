from fastapi import FastAPI, WebSocket
import asyncio
import random

app = FastAPI()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    await websocket.send_json({"progress": 0})

    await websocket.send_json(
        {
            "metadata": {
                "type": "Restaurant",
                "name": "The Best Restaurant",
                "location": {"lat": 37.7749, "lng": -122.4194},
            }
        }
    )

    await websocket.send_json({"progress": random.randint(5, 15)})

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

    await websocket.send_json({"progress": random.randint(20, 30)})

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

    await websocket.send_json({"progress": random.randint(35, 45)})

    await asyncio.sleep(1)

    await websocket.send_json(
        {
            "competitors": [
                {"lat": 37.7749, "lng": -122.42},
                {"lat": 37.7769, "lng": -122.4194},
                {"lat": 37.7759, "lng": -122.4184},
            ]
        }
    )

    await websocket.send_json({"progress": random.randint(50, 60)})

    await asyncio.sleep(1)

    await websocket.send_json({"progress": random.randint(65, 75)})

    await asyncio.sleep(1)

    await websocket.send_json({"progress": random.randint(80, 85)})

    await asyncio.sleep(1)

    await websocket.send_json({"progress": 100})



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
