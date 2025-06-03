from flask import Flask, request, jsonify
from geopy.distance import geodesic

app = Flask(__name__)

# 模擬的使用者位置資料（平常應該從資料庫讀取）
users = [
    {"id": "user1", "lat": 25.0330, "lng": 121.5654, "device_token": "abc123"},  # 台北101附近
    {"id": "user2", "lat": 25.0350, "lng": 121.5650, "device_token": "def456"},
    {"id": "user3", "lat": 24.9900, "lng": 121.5000, "device_token": "ghi789"}   # 比較遠
]

@app.route("/api/send-sos", methods=["POST"])
def send_sos():
    data = request.json
    lat = data['lat']
    lng = data['lng']
    sender_id = data['userId']

    # 找出 3 公里範圍內的其他使用者
    radius_km = 30
    nearby = []

    for user in users:
        if user["id"] == sender_id:
            continue  # 不通知自己
        dist = geodesic((lat, lng), (user["lat"], user["lng"])).km
        if dist <= radius_km:
            nearby.append(user)

    # 模擬發送通知
    for u in nearby:
        print(f"🚨 發送通知給 {u['id']}，位置在 {u['lat']}, {u['lng']}，裝置 {u['device_token']}")

    return jsonify({
        "message": f"已通知 {len(nearby)} 位使用者",
        "notified_users": [u["id"] for u in nearby]
    })

if __name__ == "__main__":
    app.run(debug=True)