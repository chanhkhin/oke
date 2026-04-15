const eraWidget = new EraWidget();
let actionV1 = null; // Tiến Lùi
let actionV2 = null; // Trái Phải
let actionV3 = null; // Mode Auto/Manual

const labelLeft = document.getElementById('labelLeft');
const labelRight = document.getElementById('labelRight');

// Khởi tạo E-Ra
eraWidget.init({
    onConfiguration: (configuration) => {
        if (configuration.actions && configuration.actions.length >= 3) {
            actionV1 = configuration.actions[0];
            actionV2 = configuration.actions[1];
            actionV3 = configuration.actions[2];
        }
    }
});

// ================= HÀM GỬI LỆNH TRỰC TIẾP =================
function sendV1(value) {
    labelRight.textContent = value;
    if (actionV1) eraWidget.triggerAction(actionV1.action, null, { value: value });
}

function sendV2(value) {
    labelLeft.textContent = value;
    if (actionV2) eraWidget.triggerAction(actionV2.action, null, { value: value });
}

// ================= GẮN SỰ KIỆN CHO TAY PHẢI (V1: TIẾN / LÙI) =================
const btnUp = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');
const centerV1 = 1494; // Điểm dừng tuyệt đối

// Nút Tiến
btnUp.addEventListener('pointerdown', () => { btnUp.classList.add('active'); sendV1(2025); });
btnUp.addEventListener('pointerup', () => { btnUp.classList.remove('active'); sendV1(centerV1); });
btnUp.addEventListener('pointerleave', () => { btnUp.classList.remove('active'); sendV1(centerV1); });

// Nút Lùi
btnDown.addEventListener('pointerdown', () => { btnDown.classList.add('active'); sendV1(1027); });
btnDown.addEventListener('pointerup', () => { btnDown.classList.remove('active'); sendV1(centerV1); });
btnDown.addEventListener('pointerleave', () => { btnDown.classList.remove('active'); sendV1(centerV1); });


// ================= GẮN SỰ KIỆN CHO TAY TRÁI (V2: TRÁI / PHẢI) =================
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const centerV2 = 1497; // Điểm dừng tuyệt đối

// Nút Rẽ Trái
btnLeft.addEventListener('pointerdown', () => { btnLeft.classList.add('active'); sendV2(987); });
btnLeft.addEventListener('pointerup', () => { btnLeft.classList.remove('active'); sendV2(centerV2); });
btnLeft.addEventListener('pointerleave', () => { btnLeft.classList.remove('active'); sendV2(centerV2); });

// Nút Rẽ Phải
btnRight.addEventListener('pointerdown', () => { btnRight.classList.add('active'); sendV2(1983); });
btnRight.addEventListener('pointerup', () => { btnRight.classList.remove('active'); sendV2(centerV2); });
btnRight.addEventListener('pointerleave', () => { btnRight.classList.remove('active'); sendV2(centerV2); });


// ================= XỬ LÝ NÚT MODE AUTO/MANUAL (V3) =================
const btnManual = document.getElementById('btnManual');
const btnAuto = document.getElementById('btnAuto');

btnManual.addEventListener('click', () => {
    btnManual.classList.add('active-manual');
    btnAuto.classList.remove('active-auto');
    if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: 1000 });
});

btnAuto.addEventListener('click', () => {
    btnAuto.classList.add('active-auto');
    btnManual.classList.remove('active-manual');
    if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: 2000 });
});
