// 1. Khởi tạo các biến toàn cục
const eraWidget = new EraWidget();
let actionV1 = null;

// Lấy các phần tử HTML
const slider = document.getElementById('signalSlider');
const label = document.getElementById('valLabel');

// 2. Kết nối và lấy cấu hình từ E-Ra Portal
eraWidget.init({
    onConfiguration: (configuration) => {
        // Giả định Action điều khiển chân V1 là action đầu tiên (index 0) trên Portal của bạn
        if (configuration.actions && configuration.actions.length > 0) {
            actionV1 = configuration.actions[0];
            console.log("Đã kết nối Action V1:", actionV1);
        } else {
            console.error("Chưa cấu hình Action trên E-Ra Portal!");
        }
    },
    onValues: (values) => {
        // Chân V1 chỉ dùng để gửi lệnh (Write) nên không cần xử lý dữ liệu nhận về ở đây
    }
});

// 3. Xử lý sự kiện khi kéo thanh trượt
slider.addEventListener('input', function() {
    const value = parseInt(this.value);
    
    // Cập nhật số hiển thị trên màn hình
    label.textContent = value;
    
    // Gửi lệnh xuống ESP32
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: value });
    }
});

// 4. Xử lý sự kiện khi nhấn nút Reset về 1500
// Chú ý: Hàm này được gọi từ thuộc tính onclick trong file HTML
window.resetToCenter = function() {
    const centerValue = 1500;
    
    // Cập nhật giao diện
    slider.value = centerValue;
    label.textContent = centerValue;
    
    // Gửi lệnh 1500 xuống ESP32
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: centerValue });
    }
};
