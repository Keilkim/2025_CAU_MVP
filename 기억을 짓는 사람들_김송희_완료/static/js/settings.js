/**
 * 설정 페이지 JavaScript - 프리셋 시스템
 */

document.addEventListener('DOMContentLoaded', () => {
    // 색상 프리셋 (치매 환자에게 적합한 부드러운 색상들)
    const COLORS = [
        // 따뜻한 색상
        '#FF6B6B', '#FFA07A', '#FFD700', '#FF8C00', '#FF69B4',
        // 자연 색상
        '#98D8C8', '#90EE90', '#228B22', '#87CEEB', '#B8E0D2',
        // 편안한 색상
        '#E6E6FA', '#DDA0DD', '#9370DB', '#6A5ACD', '#87CEFA',
        // 따스한 색상
        '#FFB6C1', '#FFDAB9', '#F0E68C', '#E0FFFF', '#FFF8DC'
    ];

    // 상태 관리
    let selectedColors = [];
    let selectedMusic = null;
    let selectedMemory = null;

    // DOM 요소
    const colorGrid = document.getElementById('colorGrid');
    const musicGroup = document.getElementById('musicGroup');
    const memoryGroup = document.getElementById('memoryGroup');
    const startBtn = document.getElementById('startBtn');
    const startHint = document.getElementById('startHint');
    const logoutBtn = document.getElementById('logoutBtn');
    const backBtn = document.getElementById('backBtn');

    // 모달 요소
    const presetModal = document.getElementById('presetModal');
    const presetNameInput = document.getElementById('presetNameInput');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalSaveBtn = document.getElementById('modalSaveBtn');

    // 색상 그리드 생성
    COLORS.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.backgroundColor = color;
        btn.dataset.color = color;
        btn.addEventListener('click', () => toggleColor(color, btn));
        colorGrid.appendChild(btn);
    });

    // 색상 토글
    function toggleColor(color, btn) {
        const index = selectedColors.indexOf(color);
        if (index > -1) {
            selectedColors.splice(index, 1);
            btn.classList.remove('selected');
        } else {
            if (selectedColors.length >= 5) {
                alert('최대 5개까지 선택할 수 있습니다.');
                return;
            }
            selectedColors.push(color);
            btn.classList.add('selected');
        }
        updateStartButton();
    }

    // 음악 분위기 선택
    musicGroup.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            musicGroup.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMusic = btn.dataset.value;
            updateStartButton();
        });
    });

    // 기억 유형 선택
    memoryGroup.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            memoryGroup.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedMemory = btn.dataset.value;
            updateStartButton();
        });
    });

    // 시작 버튼 상태 업데이트
    function updateStartButton() {
        const isValid = selectedColors.length >= 1;
        startBtn.disabled = !isValid;

        if (isValid) {
            startHint.textContent = `색상 ${selectedColors.length}개 선택됨`;
            startHint.style.color = '#4A90A4';
        } else {
            startHint.textContent = '색상을 1개 이상 선택해주세요';
            startHint.style.color = '#999';
        }
    }

    // 저장 및 시작 버튼 클릭 - 모달 표시
    startBtn.addEventListener('click', () => {
        if (selectedColors.length < 1) {
            alert('색상을 1개 이상 선택해주세요.');
            return;
        }
        openModal();
    });

    // 모달 열기
    function openModal() {
        presetModal.classList.add('show');
        presetNameInput.value = '';
        presetNameInput.focus();
    }

    // 모달 닫기
    function closeModal() {
        presetModal.classList.remove('show');
    }

    // 모달 취소 버튼
    modalCancelBtn.addEventListener('click', closeModal);

    // 모달 오버레이 클릭 시 닫기
    presetModal.addEventListener('click', (e) => {
        if (e.target === presetModal) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && presetModal.classList.contains('show')) {
            closeModal();
        }
    });

    // 엔터 키로 저장
    presetNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            savePreset();
        }
    });

    // 모달 저장 버튼
    modalSaveBtn.addEventListener('click', savePreset);

    // 프리셋 저장
    async function savePreset() {
        const presetName = presetNameInput.value.trim();

        if (!presetName) {
            alert('설정 이름을 입력해주세요.');
            presetNameInput.focus();
            return;
        }

        modalSaveBtn.disabled = true;
        modalSaveBtn.textContent = '저장 중...';

        try {
            const response = await fetch('/api/presets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: presetName,
                    colors: selectedColors,
                    music_mood: selectedMusic,
                    memory_type: selectedMemory
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // 세션 스토리지에 선택된 프리셋 ID 저장
                sessionStorage.setItem('selectedPresetId', data.preset.id);
                // 디스플레이 페이지로 이동
                window.location.href = '/display';
            } else {
                alert(data.error || '설정 저장에 실패했습니다.');
            }
        } catch (error) {
            alert('서버 연결에 실패했습니다.');
        } finally {
            modalSaveBtn.disabled = false;
            modalSaveBtn.textContent = '저장 및 시작';
        }
    }

    // 뒤로가기 버튼
    backBtn.addEventListener('click', async () => {
        // 프리셋이 있는지 확인
        try {
            const response = await fetch('/api/presets');
            const data = await response.json();

            if (data.count > 0) {
                window.location.href = '/presets';
            } else {
                // 프리셋이 없으면 그냥 경고
                alert('저장된 설정이 없습니다. 먼저 설정을 저장해주세요.');
            }
        } catch (error) {
            window.location.href = '/presets';
        }
    });

    // 로그아웃
    logoutBtn.addEventListener('click', async () => {
        if (!confirm('로그아웃 하시겠습니까?')) return;

        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            alert('로그아웃에 실패했습니다.');
        }
    });
});
