const eraWidget = new EraWidget();
let actionV1, actionV2, actionV3, actionV4;

// Mảng chứa các UID đã thêm tạm thời chưa lưu
let tempCheckpoints = []; 
// Dữ liệu chính thức được lấy từ LocalStorage
let savedCheckpoints = JSON.parse(localStorage.getItem('AGV_Checkpoints')) || [];

const uidInput = document.getElementById('uidInput');
const checkpointListDiv = document.getElementById('checkpointList');
const gotoListDiv = document.getElementById('gotoList');

eraWidget.init({
    onConfiguration: (conf) => {
        // Ánh xạ các chân điều khiển dựa theo thứ tự trên E-Ra config
        if(conf.actions) {
            actionV1 = conf.actions[0]; // Throttle (V1)
            actionV2 = conf.actions[1]; // Steering (V2)
            actionV3 = conf.actions[2]; // Mode & Goto (Numeric - V3)
            if(conf.actions.length > 3) {
                actionV4 = conf.actions[3]; // Gửi/Nhận UID String (V4)
            }
        }
    },
    onValues: (values) => {
        // Lắng nghe dữ liệu UID gửi lên từ ESP32 qua chân V4
        if (actionV4 && values[actionV4.id]) {
            const receivedUID = values[actionV4.id].value;
            // Nếu có dữ liệu trả về, tự động điền vào ô input
            if (receivedUID && String(receivedUID).trim() !== "") {
                uidInput.value = receivedUID;
            }
        }
    }
});

// --- HÀM RENDER GIAO DIỆN ---
function renderUI() {
    // 1. Render danh sách thẻ Điểm A, B, C (hiển thị cả mảng temp)
    checkpointListDiv.innerHTML = '';
    let displayList = tempCheckpoints.length > 0 ? tempCheckpoints : savedCheckpoints;
    
    displayList.forEach((cp, index) => {
        const letter = String.fromCharCode(65 + index);
        const card = document.createElement('div');
        card.className = 'point-card';
        card.innerHTML = `
            <span class="letter">${letter}</span>
            <span class="uid-label">${cp.uid}</span>
        `;
        checkpointListDiv.appendChild(card);
    });

    // 2. Render Nút GOTO dựa trên dữ liệu ĐÃ LƯU
    gotoListDiv.innerHTML = '';
    if (savedCheckpoints.length === 0) {
        gotoListDiv.innerHTML = '<div class="no-data-msg">Chưa có điểm lưu nào. Hãy quét UID và bấm LƯU DỮ LIỆU.</div>';
    } else {
        savedCheckpoints.forEach((cp, index) => {
            const letter = String.fromCharCode(65 + index);
            const btn = document.createElement('button');
            btn.className = 'btn-goto';
            btn.innerHTML = `GOTO ĐIỂM ${letter} <span class="uid-txt">[UID: ${cp.uid}]</span>`;
            
            // SỰ KIỆN KHI BẤM GOTO
            btn.addEventListener('click', () => {
                // Tạo hiệu ứng nháy
                btn.style.background = "#FF5500";
                setTimeout(() => btn.style.background = "", 300);

                // Gửi lệnh Số qua V3 (A=2001, B=2002, C=2003...) để ESP32 biết điểm đến
                let cmdNumeric = 2001 + index;
                if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: cmdNumeric });
                
                // Gửi kèm lệnh Chuỗi UID thẳng qua V4 để dự phòng
                if (actionV4) eraWidget.triggerAction(actionV4.action, null, { value: cp.uid });
            });
            gotoListDiv.appendChild(btn);
        });
    }
}

// --- CÁC SỰ KIỆN NÚT BẤM AUTO ---
// Thêm điểm vào mảng tạm
document.getElementById('btnAdd').addEventListener('click', () => {
    const uid = uidInput.value.trim();
    if (uid === "") return alert("Vui lòng đợi quét hoặc nhập thủ công UID!");
    
    // Lấy danh sách hiện tại để nối tiếp
    let currentList = tempCheckpoints.length > 0 ? tempCheckpoints : [...savedCheckpoints];
    currentList.push({ uid: uid });
    tempCheckpoints = currentList;
    
    uidInput.value = ""; // Xóa trắng sau khi thêm
    renderUI();
});

// Lưu Dữ Liệu
document.getElementById('btnSave').addEventListener('click', () => {
    if (tempCheckpoints.length > 0) {
        savedCheckpoints = [...tempCheckpoints];
        localStorage.setItem('AGV_Checkpoints', JSON.stringify(savedCheckpoints));
        tempCheckpoints = []; // Xóa tạm
        alert("Đã lưu lộ trình thành công!");
        renderUI();
    } else {
        alert("Bạn chưa thêm điểm mới nào!");
    }
});

// Reset
document.getElementById('btnReset').addEventListener('click', () => {
    if(confirm("Bạn có chắc muốn xóa toàn bộ lộ trình đã lưu? AGV sẽ không còn điểm để Goto.")) {
        tempCheckpoints = [];
        savedCheckpoints = [];
        localStorage.removeItem('AGV_Checkpoints');
        renderUI();
    }
});

// --- CHUYỂN CHẾ ĐỘ MANUAL / AUTO ---
const autoPanel = document.getElementById('autoPanel');
const manualPanel = document.getElementById('manualPanel');
const btnManual = document.getElementById('btnManual');
const btnAuto = document.getElementById('btnAuto');

btnManual.addEventListener('click', () => {
    btnManual.classList.add('active-manual');
    btnAuto.classList.remove('active-auto');
    autoPanel.classList.remove('show');
    manualPanel.classList.remove('hidden');
    if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: 1000 }); // Báo ESP32 chuyển Mode Manual
});

btnAuto.addEventListener('click', () => {
    btnAuto.classList.add('active-auto');
    btnManual.classList.remove('active-manual');
    autoPanel.classList.add('show');
    manualPanel.classList.add('hidden');
    renderUI();
    if (actionV3) eraWidget.triggerAction(actionV3.action, null, { value: 2000 }); // Báo ESP32 chờ lệnh Goto
});

// --- ĐIỀU KHIỂN TAY MANUAL ---
function sendV1(v) { document.getElementById('labelRight').textContent = v; if(actionV1) eraWidget.triggerAction(actionV1.action, null, {value: v}); }
function sendV2(v) { document.getElementById('labelLeft').textContent = v; if(actionV2) eraWidget.triggerAction(actionV2.action, null, {value: v}); }

const bindBtn = (id, vDown, vUp, func) => {
    const b = document.getElementById(id);
    b.addEventListener('pointerdown', () => func(vDown));
    b.addEventListener('pointerup', () => func(vUp));
    b.addEventListener('pointerleave', () => func(vUp));
};

bindBtn('btnUp', 2025, 1494, sendV1);
bindBtn('btnDown', 1027, 1494, sendV1);
bindBtn('btnLeft', 987, 1497, sendV2);
bindBtn('btnRight', 1983, 1497, sendV2);

// Khởi tạo hiển thị lần đầu
renderUI();
