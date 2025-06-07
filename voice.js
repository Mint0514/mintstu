function mainpage() {
    window.location.href ="index.html";
}

//錄音&停止
let mediaRecorder;
let audioChunks = [];   
let startTime;

document.getElementById("startRecord").addEventListener("click", startRecording);
document.getElementById("stopRecord").addEventListener("click", stopRecording);

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  startTime = new Date();
  audioChunks = [];

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    saveRecording(blob, startTime, duration);
    displayRecording(blob, startTime, duration);
  };

  mediaRecorder.start();
  document.getElementById("startRecord").disabled = true;
  document.getElementById("stopRecord").disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  document.getElementById("startRecord").disabled = false;
  document.getElementById("stopRecord").disabled = true;
}

//儲存聲音到本地

function saveRecording(blob, startTime, duration) {
  const reader = new FileReader();
  reader.onload = function () {
    const base64Audio = reader.result;
    const recordings = JSON.parse(localStorage.getItem("savedRecordings") || "[]");
    recordings.push({
      startTime: startTime.toISOString(),
      duration,
      base64Audio
    });
    localStorage.setItem("savedRecordings", JSON.stringify(recordings));
  };
  reader.readAsDataURL(blob);
}



// ✅ 顯示錄音清單（包含格式化時間）
function displayRecording(blob, startTime, duration) {
  const audioURL = URL.createObjectURL(blob);
  const durationText = formatDuration(duration);

  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = audioURL;

  const link = document.createElement('a');
  link.href = audioURL;
  link.download = `recording_${startTime.toISOString()}.webm`;
  link.textContent = `下載錄音（${startTime.toLocaleTimeString()}，${durationText}）`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "🗑 刪除";
  const entry = document.createElement('div');
  entry.classList.add("voice-entry");

  deleteBtn.onclick = () => deleteRecording(startTime.toISOString(), audioURL, entry);

  entry.appendChild(audio);
  entry.appendChild(link);
  entry.appendChild(deleteBtn);
  document.getElementById("recordingsList").appendChild(entry);
}

// ✅ 格式化時間：幾分幾秒
function formatDuration(seconds) {
  seconds = parseFloat(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secDecimal = (seconds % 60).toFixed(2);

  let result = "";
  if (hours > 0) result += `${hours}小時`;
  if (minutes > 0 || hours > 0) result += `${minutes}分`;
  result += `${secDecimal}秒`;

  return result;
}

// ✅ 載入歷史錄音（刷新仍保留）
window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("savedRecordings") || "[]");
  saved.forEach(item => {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = item.base64Audio;

    const link = document.createElement('a');
    link.href = item.base64Audio;
    link.download = `recording_${item.startTime}.webm`;
    link.textContent = `下載錄音（${new Date(item.startTime).toLocaleTimeString()}，${formatDuration(item.duration)}）`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "🗑 刪除";

    const entry = document.createElement('div');
    entry.classList.add("voice-entry");

    deleteBtn.onclick = () => deleteRecording(item.startTime, item.base64Audio, entry);

    entry.appendChild(audio);
    entry.appendChild(link);
    entry.appendChild(deleteBtn);
    document.getElementById("recordingsList").appendChild(entry);
  });
};

// ✅ 允許外部觸發錄音（例如 index.html 裡的求救按鈕呼叫）
window.startSOSRecording = async function () {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    await startRecording();
  }};


  //刪除

  function clearRecordings() {
  const confirmClear = confirm("你確定要清除所有錄音紀錄嗎？此操作無法還原！");
  if (confirmClear) {
    localStorage.removeItem("savedRecordings"); // 清除資料
    document.getElementById("recordingsList").innerHTML = ""; // 清空畫面
    alert("所有錄音紀錄已清除！");
  }
}

function deleteRecording(startTimeISO, audioURL, entryElement) {
  const firstConfirm = confirm("你確定要刪除這筆錄音嗎？");
  if (!firstConfirm) return;

  const secondConfirm = confirm("⚠️ 此動作無法還原，確定要刪除？");
  if (!secondConfirm) return;

  // 移除畫面元素
  entryElement.remove();

  // 更新 localStorage
  const recordings = JSON.parse(localStorage.getItem("savedRecordings") || "[]");
  const updated = recordings.filter(item => item.startTime !== startTimeISO);
  localStorage.setItem("savedRecordings", JSON.stringify(updated));

  alert("已刪除該筆錄音");
}