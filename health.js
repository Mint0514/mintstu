function mainpage() {
    window.location.href ="index.html";
}

// 載入資料
window.onload = function () {
  const saved = localStorage.getItem("healthInfo");
  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById("name").value = data.name || "";
    document.getElementById("birthdate").value = data.birthdate || "";
    document.getElementById("idNumber").value = data.idNumber || "";
    document.getElementById("healthCard").value = data.healthCard || "";
    document.getElementById("allergies").value = data.allergies || "";
    document.getElementById("notes").value = data.notes || "";
    document.getElementById("emergencyPhone").value = data.emergencyPhone || "";
    document.getElementById("emergencyName").value = data.emergencyName || "";
  }
};

// 儲存資料
document.getElementById("healthForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    birthdate: document.getElementById("birthdate").value,
    idNumber: document.getElementById("idNumber").value,
    healthCard: document.getElementById("healthCard").value,
    allergies: document.getElementById("allergies").value,
    notes: document.getElementById("notes").value,
    emergencyPhone: document.getElementById("emergencyPhone").value,
    emergencyName: document.getElementById("emergencyName").value
  };

  localStorage.setItem("healthInfo", JSON.stringify(data));
  alert("健康資料已儲存！");
});