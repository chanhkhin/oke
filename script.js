const eraWidget = new EraWidget();
let actionV1 = null;

const slider = document.getElementById("mySlider");
const valueDisplay = document.getElementById("sliderValue");

eraWidget.init({
    onConfiguration: (configuration) => {
        if (configuration.actions && configuration.actions.length > 0) {
            actionV1 = configuration.actions[0];
            // Đảm bảo khi widget load xong, giao diện hiển thị đúng số 127
            resetToCenter();
        }
    },
    onValues: (values) => {}
});

// 1. Gửi dữ liệu khi đang kéo
slider.addEventListener("input", function() {
    const value = parseInt(this.value);
    valueDisplay.textContent = value;

    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: value });
    }
});

// 2. Hàm xử lý tự động về giữa (Joystick mode)
function resetToCenter() {
    const center = 127;
    slider.value = center;
    valueDisplay.textContent = center;

    // Gửi lệnh 127 xuống ESP32 ngay lập tức khi buông tay
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: center });
    }
}

// 3. Lắng nghe sự kiện nhả tay (Cả máy tính và điện thoại)
slider.addEventListener("mouseup", resetToCenter);   // Cho chuột
slider.addEventListener("touchend", resetToCenter);  // Cho màn hình cảm ứng (iPhone/Android)
