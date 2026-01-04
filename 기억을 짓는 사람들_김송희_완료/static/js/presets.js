/**
 * 프리셋 목록 페이지 JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    const presetsList = document.getElementById('presetsList');
    const addPresetBtn = document.getElementById('addPresetBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const guideModal = document.getElementById('guideModal');
    const guideCloseBtn = document.getElementById('guideCloseBtn');

    // 가이드 모달 닫기 및 설정 페이지로 이동
    guideCloseBtn.addEventListener('click', () => {
        guideModal.classList.remove('show');
        window.location.href = '/settings';
    });

    // 프리셋 목록 불러오기
    async function loadPresets() {
        try {
            const response = await fetch('/api/presets');
            const data = await response.json();

            if (data.presets && data.presets.length > 0) {
                renderPresets(data.presets);
            } else {
                // 프리셋이 없으면 가이드 모달 표시
                presetsList.innerHTML = `
                    <div class="no-presets">
                        <p>저장된 설정이 없습니다.</p>
                        <p style="font-size: 0.9rem; color: #999;">아래 버튼을 눌러 새 설정을 추가하세요.</p>
                    </div>
                `;
                guideModal.classList.add('show');
            }
        } catch (error) {
            console.error('프리셋 불러오기 실패:', error);
            presetsList.innerHTML = '<p style="text-align: center; color: #999;">불러오기 실패</p>';
        }
    }

    // 프리셋 렌더링
    function renderPresets(presets) {
        presetsList.innerHTML = '';

        presets.forEach(preset => {
            const card = document.createElement('div');
            card.className = 'preset-card';
            card.dataset.id = preset.id;

            // 색상 미리보기
            const colorsHtml = preset.colors.slice(0, 5).map(color =>
                `<span class="color-dot" style="background-color: ${color};"></span>`
            ).join('');

            // 정보 텍스트
            const infoItems = [];
            if (preset.music_mood) infoItems.push(preset.music_mood);
            if (preset.memory_type) infoItems.push(preset.memory_type);
            const infoText = infoItems.length > 0 ? infoItems.join(' / ') : '';

            card.innerHTML = `
                <div class="preset-content" data-id="${preset.id}">
                    <div class="preset-name">${escapeHtml(preset.name)}</div>
                    <div class="preset-info">
                        <div class="preset-colors">${colorsHtml}</div>
                        ${infoText ? `<span class="preset-tags">${infoText}</span>` : ''}
                    </div>
                </div>
                <button class="preset-delete" data-id="${preset.id}" title="삭제">X</button>
            `;

            // 카드 클릭 - 디스플레이로 이동
            card.querySelector('.preset-content').addEventListener('click', () => {
                selectPreset(preset.id);
            });

            // 삭제 버튼
            card.querySelector('.preset-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                deletePreset(preset.id, preset.name);
            });

            presetsList.appendChild(card);
        });
    }

    // 프리셋 선택 - 디스플레이로 이동
    async function selectPreset(presetId) {
        // 세션 스토리지에 선택된 프리셋 ID 저장
        sessionStorage.setItem('selectedPresetId', presetId);
        window.location.href = '/display';
    }

    // 프리셋 삭제
    async function deletePreset(presetId, presetName) {
        if (!confirm(`"${presetName}" 설정을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/presets/${presetId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                loadPresets(); // 목록 새로고침
            } else {
                alert(data.error || '삭제에 실패했습니다.');
            }
        } catch (error) {
            alert('서버 연결에 실패했습니다.');
        }
    }

    // 새 설정 추가
    addPresetBtn.addEventListener('click', () => {
        window.location.href = '/settings';
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

    // HTML 이스케이프
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 페이지 로드 시 프리셋 불러오기
    loadPresets();
});
