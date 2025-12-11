// ===== Timer =====
let seconds = 0;
let interval;
let studyChart; // Biến chart

function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
        saveTime(seconds);
        updateChart();
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function resetTimer() {
    clearInterval(interval);
    seconds = 0;
    updateTimerDisplay();
    updateChart();
}

function updateTimerDisplay() {
    let h = String(Math.floor(seconds / 3600)).padStart(2,'0');
    let m = String(Math.floor((seconds % 3600)/60)).padStart(2,'0');
    let s = String(seconds % 60).padStart(2,'0');
    document.getElementById("timer").innerText = `${h}:${m}:${s}`;
}

// ===== Lưu dữ liệu =====
function saveTime(sec) {
    let today = new Date().toLocaleDateString();
    let data = JSON.parse(localStorage.getItem('studyTime')) || {};
    data[today] = sec;
    localStorage.setItem('studyTime', JSON.stringify(data));
}

// ===== Tasks =====
function addTask() {
    let input = document.getElementById('taskInput');
    let task = input.value.trim();
    if(task === '') return;
    let taskList = document.getElementById('taskList');
    let li = document.createElement('li');
    li.innerText = task;
    li.onclick = () => { li.remove(); saveTasks(); }
    taskList.appendChild(li);
    input.value = '';
    saveTasks();
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => tasks.push(li.innerText));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        let li = document.createElement('li');
        li.innerText = task;
        li.onclick = () => { li.remove(); saveTasks(); }
        taskList.appendChild(li);
    });
}
if(document.getElementById('taskList')) loadTasks();

// ===== Chart =====
function initChart() {
    let ctx = document.getElementById('studyChart');
    if(!ctx) return;
    let data = JSON.parse(localStorage.getItem('studyTime')) || {};
    let labels = Object.keys(data);
    let values = Object.values(data).map(s => Math.floor(s/60));
    studyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ['今天'],
            datasets: [{
                label: '每日學習時間（分鐘）',
                data: values.length ? values : [0],
                backgroundColor: '#4a90e2'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Cập nhật chart khi có dữ liệu mới
function updateChart() {
    if(!studyChart) return;
    let data = JSON.parse(localStorage.getItem('studyTime')) || {};
    let labels = Object.keys(data);
    let values = Object.values(data).map(s => Math.floor(s/60));
    studyChart.data.labels = labels.length ? labels : ['今天'];
    studyChart.data.datasets[0].data = values.length ? values : [0];
    studyChart.update();
}

window.onload = initChart;
