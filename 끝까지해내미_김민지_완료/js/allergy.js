// allergy.js - 알레르기 정보 관리 기능

// 추가된 커스텀 알레르기 요인들
let customAllergies = [];

// DOM 요소들
const saveButton = document.getElementById('save-allgergie-info-touch-button');
const addButton = document.getElementById('add-touch-button');
const alertSaveDisplay = document.getElementById('alert-save-display');
const addedFactorDisplay = document.getElementById('added-factor-display');

// 직접 입력 버튼 클릭
addButton.addEventListener('click', function() {
    showAddFactorInput();
});

// 알레르기 요인 직접 입력
function showAddFactorInput() {
    // 입력 필드 생성
    const inputContainer = document.createElement('div');
    inputContainer.className = 'custom-input-container';
    inputContainer.innerHTML = `
        <input type="text" id="custom-allergy-input" class="form-input"
               placeholder="알레르기 성분 입력" style="width: 200px; display: inline-block;">
        <button class="btn btn-primary" style="padding: 8px 16px; margin-left: 10px;">추가</button>
        <button class="btn btn-secondary" style="padding: 8px 16px; margin-left: 5px;">취소</button>
    `;

    // 기존 추가 버튼을 임시로 숨기기
    addButton.style.display = 'none';
    addButton.parentElement.appendChild(inputContainer);

    const input = inputContainer.querySelector('input');
    const addBtn = inputContainer.querySelectorAll('button')[0];
    const cancelBtn = inputContainer.querySelectorAll('button')[1];

    // 입력 필드에 포커스
    input.focus();

    // 추가 버튼 클릭
    addBtn.addEventListener('click', function() {
        const value = input.value.trim();
        if (value) {
            addCustomAllergy(value);
            closeInput();
        }
    });

    // 엔터키로 추가
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            if (value) {
                addCustomAllergy(value);
                closeInput();
            }
        }
    });

    // 취소 버튼 클릭
    cancelBtn.addEventListener('click', closeInput);

    // 입력 창 닫기
    function closeInput() {
        inputContainer.remove();
        addButton.style.display = 'block';
    }
}

// 커스텀 알레르기 추가
function addCustomAllergy(allergyName) {
    if (customAllergies.includes(allergyName)) {
        showMessage('이미 추가된 알레르기입니다.', 'error');
        return;
    }

    customAllergies.push(allergyName);
    displayCustomAllergies();

    // 알레르기 태그 섹션에도 추가
    const allergieHashsContainer = document.getElementById('allergie-hashs-container');
    const tag = document.createElement('button');
    tag.className = 'factor-switch selected';
    tag.textContent = allergyName;
    tag.dataset.factor = allergyName;
    tag.dataset.custom = 'true';

    tag.addEventListener('click', function() {
        this.classList.toggle('selected');
    });

    allergieHashsContainer.appendChild(tag);
}

// 커스텀 알레르기 표시
function displayCustomAllergies() {
    addedFactorDisplay.innerHTML = '';
    customAllergies.forEach(allergy => {
        const tag = document.createElement('span');
        tag.className = 'custom-allergy-tag';
        tag.innerHTML = `
            ${allergy}
            <span class="remove-tag" data-allergy="${allergy}">&times;</span>
        `;
        tag.style.cssText = `
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            margin-right: 5px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        `;

        const removeBtn = tag.querySelector('.remove-tag');
        removeBtn.style.cssText = `
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
        `;

        removeBtn.addEventListener('click', function() {
            removeCustomAllergy(this.dataset.allergy);
        });

        addedFactorDisplay.appendChild(tag);
    });
}

// 커스텀 알레르기 제거
function removeCustomAllergy(allergyName) {
    customAllergies = customAllergies.filter(a => a !== allergyName);
    displayCustomAllergies();

    // 태그 섹션에서도 제거
    const tag = document.querySelector(`[data-factor="${allergyName}"][data-custom="true"]`);
    if (tag) {
        tag.remove();
    }
}

// 저장 버튼 클릭
saveButton.addEventListener('click', function() {
    saveAllergies();
});

// 알레르기 정보 저장
function saveAllergies() {
    if (!currentUser) {
        showMessage('로그인이 필요합니다.', 'error');
        return;
    }

    // 선택된 알레르기 수집
    const selectedAllergies = [];
    const selectedTags = document.querySelectorAll('.factor-switch.selected');

    selectedTags.forEach(tag => {
        selectedAllergies.push(tag.dataset.factor);
    });

    // 사용자 정보 업데이트
    currentUser.allergies = selectedAllergies;

    // 데이터베이스 업데이트
    if (userDatabase[currentUser.id]) {
        userDatabase[currentUser.id].allergies = selectedAllergies;
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // 저장 완료 알림
    showSaveAlert();
}

// 저장 완료 알림 표시
function showSaveAlert() {
    alertSaveDisplay.classList.add('active');

    const confirmBtn = alertSaveDisplay.querySelector('button');
    confirmBtn.onclick = function() {
        alertSaveDisplay.classList.remove('active');
        // 메인 페이지로 돌아가기
        navigateTo('main');
    };

    // 배경 클릭시 닫기
    alertSaveDisplay.addEventListener('click', function(e) {
        if (e.target === alertSaveDisplay) {
            alertSaveDisplay.classList.remove('active');
            navigateTo('main');
        }
    });
}

// 알레르기 정보 인식 함수
function recognizing() {
    const selectedAllergies = [];
    const selectedTags = document.querySelectorAll('.allergie-tag.selected');

    selectedTags.forEach(tag => {
        selectedAllergies.push(tag.dataset.factor);
    });

    return selectedAllergies;
}

// 프로필에 알레르기 저장
function saveAllerToProfile(allergies) {
    if (!currentUser) return false;

    currentUser.allergies = allergies;

    if (userDatabase[currentUser.id]) {
        userDatabase[currentUser.id].allergies = allergies;
        userDatabase[currentUser.id].lastModified = new Date().toISOString();
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    }

    return false;
}

// 알레르기 정보 초기화
function clearAllergies() {
    const tags = document.querySelectorAll('.allergie-tag');
    tags.forEach(tag => {
        tag.classList.remove('selected');
    });

    customAllergies = [];
    displayCustomAllergies();
}

// 알레르기 정보 내보내기 (JSON)
function exportAllergies() {
    if (!currentUser || !currentUser.allergies) {
        showMessage('저장된 알레르기 정보가 없습니다.', 'error');
        return;
    }

    const exportData = {
        userId: currentUser.id,
        allergies: currentUser.allergies,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `allergies_${currentUser.id}_${Date.now()}.json`);
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);

    showMessage('알레르기 정보가 내보내졌습니다.', 'success');
}

// 알레르기 정보 가져오기 (JSON)
function importAllergies(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);

            if (importData.allergies && Array.isArray(importData.allergies)) {
                // 기존 알레르기 초기화
                clearAllergies();

                // 가져온 알레르기 설정
                importData.allergies.forEach(allergy => {
                    const tag = document.querySelector(`[data-factor="${allergy}"]`);
                    if (tag) {
                        tag.classList.add('selected');
                    } else {
                        // 커스텀 알레르기로 추가
                        addCustomAllergy(allergy);
                    }
                });

                showMessage('알레르기 정보를 가져왔습니다.', 'success');
            }
        } catch (error) {
            showMessage('파일 형식이 올바르지 않습니다.', 'error');
        }
    };

    reader.readAsText(file);
}