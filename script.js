// ===== Timer =====
let seconds = 0;
let interval;
let studyChart;

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
    seconds=0;
    updateTimerDisplay();
    updateChart();
}

function updateTimerDisplay() {
    let h = String(Math.floor(seconds/3600)).padStart(2,'0');
    let m = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
    let s = String(seconds%60).padStart(2,'0');
    document.getElementById('timer').innerText = `${h}:${m}:${s}`;
}

// ===== LocalStorage =====
function saveTime(sec){
    let today = new Date().toLocaleDateString();
    let data = JSON.parse(localStorage.getItem('studyTime')) || {};
    data[today] = sec;
    localStorage.setItem('studyTime', JSON.stringify(data));
}

// ===== Chart =====
function initChart(){
    let ctx = document.getElementById('studyChart');
    if(!ctx) return;
    let data = JSON.parse(localStorage.getItem('studyTime')) || {};
    let labels = Object.keys(data);
    let values = Object.values(data).map(s=>Math.floor(s/60));
    studyChart = new Chart(ctx,{
        type:'bar',
        data:{
            labels: labels.length ? labels : ['今天'],
            datasets:[{
                label:'每日學習時間（分鐘）',
                data: values.length ? values : [0],
                backgroundColor:'#4a90e2'
            }]
        },
        options:{responsive:true, scales:{y:{beginAtZero:true}}}
    });
}

function updateChart(){
    if(!studyChart) return;
    let data = JSON.parse(localStorage.getItem('studyTime')) || {};
    let labels = Object.keys(data);
    let values = Object.values(data).map(s=>Math.floor(s/60));
    studyChart.data.labels = labels.length ? labels : ['今天'];
    studyChart.data.datasets[0].data = values.length ? values : [0];
    studyChart.update();
}
