function settings() {
  window.location.href = "settings.html";
}

function recordVoice() {
  window.location.href = "voice.html";
}

function goToHealthInfo() {
  window.location.href = "health.html";
}

function login() {
  window.location.href = "login.html";
}

const currentUserId = localStorage.getItem("userId") || "anonymous";



// ✅ 求救 + 傳送通知 + 錄音 + 撥打 119
function sosCall() {
  const confirmCall = confirm("⚠️您即將撥打緊急電話119，請確認目前處於危險狀況並準備好說明位置。");
  if (!confirmCall) return;

  // 錄音（需搭配 voice.js 定義 startSOSRecording）
  if (typeof startSOSRecording === 'function') {
    startSOSRecording();
  }

  // 發送求救通知
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      fetch('/api/send-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          userId: currentUserId
        })
      }).then(res => {
        if (res.ok) {
          console.log("✅ 求救通知已送出");
        } else {
          console.warn("⚠️ 通知發送失敗");
        }
      }).catch(err => {
        console.error("❌ 發送求救時出現錯誤", err);
      });
    });
  } else {
    alert("❌ 無法取得定位");
  }

  // 撥打 119
  window.location.href = "tel:119";
}

window.onload = function () {
  // ✅ 顯示登入狀態
  const userId = localStorage.getItem("userId");
  const loginStatus = document.getElementById("loginStatus");
  const loginBtn = document.getElementById("loginBtn");

  if (userId) {
    loginStatus.textContent = `👤 已登入：${userId}`;
    loginBtn.style.display = "none";
  } else {
    loginStatus.textContent = "尚未登入";
    loginBtn.style.display = "inline-block";
  }

  // ✅ 自動填入地址
  const savedAddress = localStorage.getItem('userAddress');
  if (savedAddress) {
    document.getElementById('address').value = savedAddress;
  }

  const addressInput = document.getElementById('address');
  addressInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      localStorage.setItem('userAddress', this.value);
      this.blur(); // 取消選取
    }
  });

  addressInput.addEventListener('blur', function () {
    localStorage.setItem('userAddress', this.value);
  });
};

function callFamily() {
  const info = JSON.parse(localStorage.getItem("healthInfo") || "{}");

  if (info.emergencyPhone) {
    const confirmCall = confirm(`📞 是否撥打給 ${info.emergencyName || "家人"}（${info.emergencyPhone}）？`);
    if (confirmCall) {
      window.location.href = `tel:${info.emergencyPhone}`;
    }
  } else {
    alert("⚠️ 尚未填寫家人電話，請先至健康資訊頁設定。");
  }
}