const eraWidget = new EraWidget();
let actionV1 = null; // Tiến lùi
let actionV2 = null; // Trái phải

const joyLeft = document.getElementById('joyLeft');
const labelLeft = document.getElementById('labelLeft');
const joyRight = document.getElementById('joyRight');
const labelRight = document.getElementById('labelRight');

let lastSendLeft = 0;
let lastSendRight = 0;

eraWidget.init({
    onConfiguration: (configuration) => {
        // Cấu hình: Action 0 là Tiến/Lùi (V1), Action 1 là Trái/Phải (V2)
        if (configuration.actions && configuration.actions.length >= 2) {
            actionV1 = configuration.actions[0];
            actionV2 = configuration.actions[1];
        }
    }
});

// --- XỬ LÝ JOY TRÁI (V2: TRÁI/PHẢI) ---
joyLeft.addEventListener('input', function() {
    const val = parseInt(this.value);
    labelLeft.textContent = val;
    sendData(val, 'left');
});

// --- XỬ LÝ JOY PHẢI (V1: TIẾN/LÙI) ---
joyRight.addEventListener('input', function() {
    const val = parseInt(this.value);
    labelRight.textContent = val;
    sendData(val, 'right');
});

// --- HÀM GỬI DỮ LIỆU CÓ GIỚI HẠN TỐC ĐỘ (THROTTLE) ---
function sendData(value, side) {
    const now = Date.now();
    if (side === 'left') {
        if (now - lastSendLeft > 100 && actionV2) {
            eraWidget.triggerAction(actionV2.action, null, { value: value });
            lastSendLeft = now;
        }
    } else {
        if (now - lastSendRight > 100 && actionV1) {
            eraWidget.triggerAction(actionV1.action, null, { value: value });
            lastSendRight = now;
        }
    }
}

// --- TỰ ĐỘNG VỀ GIỮA ---
const resetLeft = () => {
    joyLeft.value = 1500;
    labelLeft.textContent = 1500;
    if (actionV2) eraWidget.triggerAction(actionV2.action, null, { value: 1500 });
};

const resetRight = () => {
    joyRight.value = 1500;
    labelRight.textContent = 1500;
    if (actionV1) eraWidget.triggerAction(actionV1.action, null, { value: 1500 });
};

// Sự kiện nhả tay tay trái
joyLeft.addEventListener('mouseup', resetLeft);
joyLeft.addEventListener('touchend', resetLeft);

// Sự kiện nhả tay tay phải
joyRight.addEventListener('mouseup', resetRight);
joyRight.addEventListener('touchend', resetRight);
