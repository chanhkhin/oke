// Khởi tạo E-Ra Services 
const eraWidget = new EraWidget();

// Các biến cấu hình cũ [cite: 756]
let configTemp = null, configHumi = null;
let onBedLight = null, offBedLight = null;
let onKitchenLight = null, onLivingLight = null;
let onAirConditioner = null;

// Biến cho Joystick mới
let onJoystick = null; 
let lastSendTime = 0; // Để giới hạn tốc độ gửi tin nhắn

// Các phần tử UI Joystick
const jSlider = document.getElementById('joystickSlider');
const jLabel = document.getElementById('joystickLabel');

eraWidget.init({
    onConfiguration: (configuration) => {
        // Map các chân cũ [cite: 765]
        configTemp = configuration.realtime_configs[0];
        configHumi = configuration.realtime_configs[1];
        onBedLight = configuration.actions[0];
        offBedLight = configuration.actions[1];
        onKitchenLight = configuration.actions[2];
        onLivingLight = configuration.actions[3];
        onAirConditioner = configuration.actions[4];

        // Lấy Action Joystick (Vị trí thứ 6 trên Portal)
        if (configuration.actions.length > 5) {
            onJoystick = configuration.actions[5];
        }
    },
    onValues: (values) => {
        // Xử lý hiển thị nhiệt độ/độ ẩm realtime [cite: 773]
        if (configTemp && values[configTemp.id]) {
            updateTempGauge(values[configTemp.id].value);
        }
        if (configHumi && values[configHumi.id]) {
            updateGauge(values[configHumi.id].value);
        }
    }
});

// ============ LOGIC JOYSTICK V1 ============

if (jSlider && jLabel) {
    // 1. Khi đang kéo (Gửi tín hiệu liên tục nhưng có giới hạn tốc độ)
    jSlider.addEventListener('input', function() {
        const val = parseInt(this.value);
        jLabel.textContent = val;

        const now = Date.now();
        // Chỉ gửi dữ liệu lên ESP nếu cách lần gửi trước ít nhất 100ms
        // Điều này giúp tránh quá tải MQTT khi bạn kéo thanh trượt quá nhanh
        if (now - lastSendTime > 100) {
            if (onJoystick) {
                eraWidget.triggerAction(onJoystick.action, null, { value: val });
                lastSendTime = now;
            }
        }
    });

    // 2. Khi buông tay (Tự động về 1500)
    const handleRelease = () => {
        const center = 1500;
        jSlider.value = center;
        jLabel.textContent = center;
        
        // Gửi lệnh dừng 1500 ngay lập tức
        if (onJoystick) {
            eraWidget.triggerAction(onJoystick.action, null, { value: center });
        }
    };

    jSlider.addEventListener('mouseup', handleRelease);
    jSlider.addEventListener('touchend', handleRelease);
}

// ... [Giữ nguyên toàn bộ các hàm bổ trợ cũ như initChart, updateChart, loadSong...] ...
// [Từ dòng 283 đến dòng 855 trong file script.js của bạn]
