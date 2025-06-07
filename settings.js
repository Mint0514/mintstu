function mainpage() {
  window.location.href = "index.html";
}

function goToHealthInfo() {
  window.location.href = "health.html"; // 使用一致的 health.html
}

function goToTutorial() {
  window.location.href = "tutorial.html"; // 若還沒做，可改成 alert
}

function logout() {
  const confirmLogout = confirm("確定要登出嗎？");
  if (confirmLogout) {
    localStorage.removeItem("userId"); // 清除登入資訊
    alert("登出成功！");
    window.location.href = "login.html";
  }
}

window.onload = function () {
  const user = localStorage.getItem("userId");
  if (!user) {
    alert("請先登入！");
    window.location.href = "login.html";
  }
};

