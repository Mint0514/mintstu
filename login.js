function mainpage() {
    window.location.href ="index.html";
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("error");

  // 測試帳號資料（可再擴充）
  const fakeUsers = [
    { username: "test", password: "1234" },
    { username: "mint", password: "5678" },
    { username: "admin", password: "admin" }
  ];

  const found = fakeUsers.find(u => u.username === username && u.password === password);
  if (found) {
    localStorage.setItem("userId", username);
    window.location.href = "index.html";
  } else {
    errorDiv.textContent = "帳號或密碼錯誤，請再試一次。";
  }
});


//測試
const fakeUsers = [
  { username: "test", password: "1234" },
  { username: "mint", password: "5678" },
  { username: "admin", password: "admin" }
];

const found = fakeUsers.find(u => u.username === username && u.password === password);
if (found) {
  localStorage.setItem("userId", username);
  window.location.href = "index.html";
} else {
  errorDiv.textContent = "帳號或密碼錯誤，請再試一次。";
}


//auto login

window.onload = function () {
  const savedName = localStorage.getItem("rememberedUsername");
  if (savedName) {
    document.getElementById("username").value = savedName;
    document.getElementById("rememberMe").checked = true;
  }
};

if (document.getElementById("rememberMe").checked) {
  localStorage.setItem("rememberedUsername", username);
} else {
  localStorage.removeItem("rememberedUsername");
}





