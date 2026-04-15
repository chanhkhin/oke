const eraWidget = new EraWidget();
let actionV1 = null;

// Khởi tạo E-Ra Widget
eraWidget.init({
    onConfiguration: (configuration) => {
        // Lấy cấu hình action từ E-Ra Portal
        // LƯU Ý: Bạn phải tạo một Action gán với chân V1 trên Portal.
        // Giả sử Action này nằm ở vị trí đầu tiên (index 0) trong danh sách Actions.
        if (configuration.actions && configuration.actions.length > 0) {
            actionV1 = configuration.actions[0];
            console.log("Đã nạp cấu hình Action V1:", actionV1);
        }
    },
    onValues: (values) => {
        // Bỏ trống vì thanh trượt này chỉ gửi đi (Write), không đọc về (Read)
    }
});

// Bắt sự kiện thanh trượt
const slider = document.getElementById("mySlider");
const valueDisplay = document.getElementById("sliderValue");

slider.addEventListener("input", function() {
    const value = parseInt(this.value); // Ép kiểu về số nguyên giống param.getInt()
    
    // Cập nhật giá trị hiển thị trên màn hình
    valueDisplay.textContent = value;

    // Nếu cấu hình E-Ra đã tải xong, gửi lệnh xuống ESP32
    if (actionV1) {
        eraWidget.triggerAction(actionV1.action, null, { value: value });
    }
});
