from flask import Flask, request, jsonify
from geopy.distance import geodesic

app = Flask(__name__)

users = [
    {"id": "user1", "lat": 25.0330, "lng": 121.5654, "device_token": "abc123"},
    {"id": "user2", "lat": 25.0350, "lng": 121.5650, "device_token": "def456"},
    {"id": "user3", "lat": 24.9900, "lng": 121.5000, "device_token": "ghi789"}
]

@app.route("/api/send-sos", methods=["POST"])
def send_sos():
    data = request.json

    if not all(k in data for k in ("lat", "lng", "userId")):
        return jsonify({"error": "缺少必要欄位"}), 400

    lat = data["lat"]
    lng = data["lng"]
    sender_id = data["userId"]

    print(f"⚠️ 來自 {sender_id} 的求救：位置 ({lat}, {lng})")

    radius_km = 3
    nearby = []

    for user in users:
        if user["id"] == sender_id:
            continue
        dist = geodesic((lat, lng), (user["lat"], user["lng"])).km
        if dist <= radius_km:
            nearby.append(user)
            print(f"🚨 發送通知給 {user['id']} - 裝置 {user['device_token']}（距離 {dist:.2f} 公里）")

    return jsonify({
        "message": f"已通知 {len(nearby)} 位使用者",
        "notified_users": [
            {
                "id": u["id"],
                "lat": u["lat"],
                "lng": u["lng"],
                "distance_km": round(geodesic((lat, lng), (u["lat"], u["lng"])).km, 2)
            } for u in nearby
        ]
    })

if __name__ == "__main__":
    app.run(debug=True)