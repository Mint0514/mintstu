fetch('http://127.0.0.1:5000/api/send-sos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lat: userLat,
    lng: userLng,
    userId: "user1"
  })
})
.then(res => res.json())
.then(data => alert(data.message));