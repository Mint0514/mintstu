function callFamily() {
  alert("正在撥打家人電話...");
  // 可整合 WebRTC 或跳轉 tel:連結
}

function settings() {
  window.location.href = "settings.html";
}

function recordVoice() {
  window.location.href = "voice.html";
}

function goToHealthInfo() {
  window.location.href = "health.html";
}

function login(){
  window.location.href = "login.html";
}



navigator.geolocation.getCurrentPosition(function(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

   fetch('/api/send-sos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: latitude, lng: longitude, userId: currentUserId })
  });
});


// 載入時自動填入地址
window.onload = function () {
  const savedAddress = localStorage.getItem('userAddress');
  if (savedAddress) {
    document.getElementById('address').value = savedAddress;
  }

  // 當使用者輸入完成後按 Enter 鍵時儲存
  document.getElementById('address').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      localStorage.setItem('userAddress', this.value);
      this.blur(); // 取消選取狀態
    }
  });

  // 當使用者離開輸入框時也儲存
  document.getElementById('address').addEventListener('blur', function () {
    localStorage.setItem('userAddress', this.value);
  });
};