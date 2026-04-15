// Khởi tạo Widget
const eraWidget = new EraWidget();
let actionV1 = null;

// Lấy các thành phần giao diện
const slider = document.getElementById('joystick');
const label = document.getElementById('label');

// Cấu hình E-Ra
eraWidget.init({
    onConfiguration: (configuration) => {
        // Lấy Action đầu tiên được cấu hình trên Portal (giả định là chân V1)
        if (configuration.actions && configuration.actions.length > 0) {
            actionV1 = configuration.actions[0];
            console.log("Đã tìm thấy chân điều khiển:", actionV1);
        }
    },
    onValues: (values) => {
        // Không cần xử lý dữ liệu trả về cho nút nhấn/thanh trượt ghi dữ liệu
    }
});

/**
 * Xử lý khi người dùng đang kéo thanh trượt
 */
slider.addEventListener('input', function() {
    const val = parseInt(this.value);
    label.textContent = val;
    
    // Gửi giá trị liên tục khi kéo
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: val });
    }
});

/**
 * Xử lý khi buông tay (Dành cho máy tính)
 */
slider.addEventListener('mouseup', () => {
    returnToCenter();
});

/**
 * Xử lý khi buông tay (Dành cho điện thoại/cảm ứng)
 */
slider.addEventListener('touchend', () => {
    returnToCenter();
});

/**
 * Hàm đưa thanh trượt về giá trị trung tâm 1500
 */
function returnToCenter() {
    const center = 1500;
    
    // Cập nhật giao diện
    slider.value = center;
    label.textContent = center;
    
    // Gửi lệnh 1500 xuống ESP32 lần cuối
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: center });
    }
    
    console.log("Joystick đã nhả - Gửi giá trị dừng: 1500");
}
