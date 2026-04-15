const eraWidget = new EraWidget();
let actionV1 = null;

// Khởi tạo E-Ra Widget
eraWidget.init({
    onConfiguration: (configuration) => {
        if (configuration.actions && configuration.actions.length > 0) {
            actionV1 = configuration.actions[0];
            console.log("Đã nạp cấu hình Action V1:", actionV1);
        }
    },
    onValues: (values) => {
        // Bỏ trống
    }
});

const slider = document.getElementById("mySlider");
const valueDisplay = document.getElementById("sliderValue");

// 1. Khi đang kéo thanh trượt (Gửi dữ liệu liên tục)
slider.addEventListener("input", function() {
    const value = parseInt(this.value); 
    
    valueDisplay.textContent = value;

    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: value });
    }
});

// ================= THÊM PHẦN JOYSTICK Ở ĐÂY =================

// 2. Hàm đưa thanh trượt về vị trí trung tâm
function returnToCenter() {
    const centerValue = 127; // Trục giữa của 0 - 255
    
    // Cập nhật lại giao diện
    slider.value = centerValue;
    valueDisplay.textContent = centerValue;

    // Gửi lệnh 127 xuống ESP32 để dừng động cơ
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: centerValue });
    }
}

// 3. Bắt sự kiện khi buông tay
slider.addEventListener("mouseup", returnToCenter); // Khi nhả chuột (trên máy tính)
slider.addEventListener("touchend", returnToCenter); // Khi nhả tay (trên điện thoại)
