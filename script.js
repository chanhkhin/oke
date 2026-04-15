// ============ 1. KHỞI TẠO CÁC BIẾN AGV & E-RA ==============
const eraWidget = new EraWidget();
const agvSlider = document.getElementById("agvSlider");
const valDisplay = document.getElementById("valDisplay");

let agvAction = null; // Biến lưu hành động Tiến/Lùi
let configBattery = null; // (Ví dụ) Cấu hình nhận dữ liệu pin/vận tốc
let isAgvActive = true;

// ============ 2. XỬ LÝ E-RA SDK ==============
eraWidget.init({
    onConfiguration: (configuration) => {
        // Ánh xạ Action đầu tiên trong thiết lập E-Ra cho AGV
        agvAction = configuration.actions[0];
        
        // Ánh xạ các chân cảm biến (nếu bạn có biểu đồ)
        // configuration.realtime_configs[0] có thể là Vận tốc hoặc Pin
        configBattery = configuration.realtime_configs[0];
    },
    onValues: (values) => {
        // Nếu có dữ liệu cảm biến trả về từ Robot
        if (configBattery && values[configBattery.id]) {
            const batteryVal = values[configBattery.id].value;
            // Cập nhật biểu đồ nếu bạn muốn theo dõi vận tốc/pin theo thời gian
            updateChart(batteryVal, NaN); 
        }
    },
});

// ============ 3. XỬ LÝ ĐIỀU KHIỂN SLIDER (JOYSTICK) ==============
if (agvSlider) {
    // Khi đang kéo (Gửi liên tục)
    agvSlider.addEventListener("input", function () {
        const value = parseInt(this.value);
        valDisplay.textContent = value;
        
        if (agvAction) {
            eraWidget.triggerAction(agvAction.action, null, { value: value });
        }
    });

    // Khi thả tay ra (Tự động về 1500 - Dừng AGV)
    agvSlider.addEventListener("change", function () {
        const stopValue = 1500;
        this.value = stopValue;
        valDisplay.textContent = stopValue;
        
        if (agvAction) {
            eraWidget.triggerAction(agvAction.action, null, { value: stopValue });
        }
    });
}

// ============ 4. BIỂU ĐỒ REALTIME (GIỮ LẠI ĐỂ THEO DÕI) ==============
let myChart;
let chartData = [];
const maxDataPoints = 20;

function initChart() {
    const canvas = document.getElementById("dataChart");
    if (!canvas) return; // Nếu HTML không có canvas thì bỏ qua

    const ctx = canvas.getContext("2d");
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "AGV Value Monitoring",
                data: [],
                borderColor: "#3498db",
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                tension: 0.4,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

function updateChart(val) {
    if (!myChart) return;
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    chartData.push({ time: timeLabel, value: val });
    if (chartData.length > maxDataPoints) chartData.shift();

    myChart.data.labels = chartData.map(d => d.time);
    myChart.data.datasets[0].data = chartData.map(d => d.value);
    myChart.update();
}

// ============ 5. TÍNH NĂNG TOÀN MÀN HÌNH ==============
const fullscreenButton = document.createElement("button");
fullscreenButton.innerHTML = '⛶'; // Icon đơn giản
fullscreenButton.style.position = "fixed";
fullscreenButton.style.bottom = "10px";
fullscreenButton.style.right = "10px";
document.body.appendChild(fullscreenButton);

fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Khởi chạy khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
    initChart();
});
