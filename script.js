const eraWidget = new EraWidget();
let actionV1 = null; // Tiến Lùi
let actionV2 = null; // Trái Phải
let actionV3 = null; // Mode Auto/Manual

const joyLeft = document.getElementById('joyLeft');
const labelLeft = document.getElementById('labelLeft');
const joyRight = document.getElementById('joyRight');
const labelRight = document.getElementById('labelRight');

const btnManual = document.getElementById('btnManual');
const btnAuto = document.getElementById('btnAuto');

let lastSendLeft = 0;
let lastSendRight = 0;

eraWidget.init({
    onConfiguration: (configuration) => {
        // Cấu hình Action trên Portal E-Ra:
        // Index 0 -> V1, Index 1 -> V2, Index 2 -> V3
        if (configuration.actions && configuration.actions.length >= 3) {
            actionV1 = configuration.actions[0];
            actionV2 = configuration.actions[1];
            actionV3 = configuration.actions[2];
        }
    }
});

// ================= XỬ LÝ CHẾ ĐỘ AUTO/MANUAL (V3) =================
btnManual.addEventListener('click', () => {
    btnManual.classList.add('active-manual');
    btnAuto.classList.remove('active-auto');
    if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: 1000 }); // Gửi 1000 cho Manual
});

btnAuto.addEventListener('click', () => {
    btnAuto.classList.add('active-auto');
    btnManual.classList.remove('active-manual');
    if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: 2000 }); // Gửi 2000 cho Auto
});


// ================= XỬ LÝ JOYSTICK =================
joyLeft.addEventListener('input', function() {
    const val = parseInt(this.value);
    labelLeft.textContent = val;
    sendData(val, 'left');
});

joyRight.addEventListener('input', function() {
    const val = parseInt(this.value);
    labelRight.textContent = val;
    sendData(val, 'right');
});

// Hàm gửi dữ liệu có chống Spam (Throttle 100ms)
function sendData(value, side) {
    const now = Date.now();
    if (side === 'left') {
        if (now - lastSendLeft > 40 && actionV2) {
            eraWidget.triggerAction(actionV2.action, null, { value: value });
            lastSendLeft = now;
        }
    } else {
        if (now - lastSendRight > 40 && actionV1) {
            eraWidget.triggerAction(actionV1.action, null, { value: value });
            lastSendRight = now;
        }
    }
}

// TỰ ĐỘNG VỀ GIỮA KHỚP 100% VỚI CODE ESP32 ĐỂ TRÁNH LỆCH DEADZONE
const resetLeft = () => {
    const centerLR = 1497;
    joyLeft.value = centerLR;
    labelLeft.textContent = centerLR;
    if (actionV2) eraWidget.triggerAction(actionV2.action, null, { value: centerLR });
};

const resetRight = () => {
    const centerFB = 1494;
    joyRight.value = centerFB;
    labelRight.textContent = centerFB;
    if (actionV1) eraWidget.triggerAction(actionV1.action, null, { value: centerFB });
};

joyLeft.addEventListener('mouseup', resetLeft);
joyLeft.addEventListener('touchend', resetLeft);

joyRight.addEventListener('mouseup', resetRight);
joyRight.addEventListener('touchend', resetRight);
