// main.js - 메인 네비게이션 및 페이지 전환

// 페이지 요소들
const pages = {
    login: document.getElementById('allergie-html'),
    main: document.getElementById('main-container'),
    allergy: document.getElementById('allergie-writing-container'),
    photo: document.getElementById('show-pics-html'),
    result: document.getElementById('result-html')
};

// 네비게이션 버튼들
const settingProfileButton = document.getElementById('setting-profile-touch-button');
const takePicsButton = document.getElementById('take-pics-touch-button');
const photoInput = document.getElementById('photo-input');
const backButton = document.getElementById('back-touch-button');
const veforeButton = document.getElementById('vefore-touch-button'); // JSON대로 수정
const analysisButton = document.getElementById('analysis-touch-button');

// 현재 선택된 이미지
let selectedImage = null;

// 페이지 전환 헬퍼 함수
function navigateTo(pageName) {
    Object.keys(pages).forEach(key => {
        pages[key].classList.remove('active');
    });

    if (pages[pageName]) {
        pages[pageName].classList.add('active');
    }
}

// 설정 버튼 클릭 - 알레르기 정보 페이지로 이동
settingProfileButton.addEventListener('click', function() {
    navigateTo('allergy');
    loadAllergyFactors();
});

// 사진 촬영/선택 버튼 클릭
takePicsButton.addEventListener('click', function() {
    photoInput.click();
});

// 파일 선택 처리
photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            selectedImage = file;
            nextRun();
        } else {
            showMessage('이미지 파일만 선택 가능합니다.', 'error');
        }
    }
});

// 다음 실행 함수 (사진 선택 후)
function nextRun() {
    if (selectedImage) {
        navigateTo('photo');
        displaySelectedImage();
    }
}

// 선택된 이미지 표시
function displaySelectedImage() {
    const showDisplay = document.getElementById('show-display');
    const reader = new FileReader();

    reader.onload = function(e) {
        showDisplay.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
    };

    reader.readAsDataURL(selectedImage);
}

// 뒤로가기 버튼들
backButton.addEventListener('click', function() {
    backBefore();
});

veforeButton.addEventListener('click', function() {
    back();
});

// 알레르기 페이지에서 메인으로
function backBefore() {
    navigateTo('main');
}

// 사진 페이지에서 메인으로
function back() {
    navigateTo('main');
    selectedImage = null;
    photoInput.value = '';
}

// 분석 버튼 클릭
analysisButton.addEventListener('click', function() {
    if (selectedImage) {
        consider();
    }
});

// 알레르기 팩터 목록 (기본 데이터)
const allergyFactors = [
    '계란', '우유', '메밀', '땅콩', '대두', '밀',
    '고등어', '게', '새우', '돼지고기', '복숭아', '토마토',
    '아황산류', '호두', '닭고기', '쇠고기', '오징어', '조개류', '잣'
];

// 알레르기 요인 불러오기
async function loadAllergyFactors() {
    try {
        // allergie_factors.json 로드
        const response = await fetch('data/allergie_factors.json');
        const factorsData = await response.json();

        const allergieHashsContainer = document.getElementById('allergie-hashs-container');
        allergieHashsContainer.innerHTML = '';

        const factors = factorsData[currentLanguage || 'ko'];
        const koreanFactors = factorsData['ko']; // 매칭을 위한 한국어 키값

        factors.forEach((factor, index) => {
            const tag = document.createElement('button');
            tag.className = 'factor-switch';
            tag.textContent = factor;
            tag.dataset.factor = koreanFactors[index]; // 저장은 한국어 키로
            tag.dataset.displayFactor = factor; // 표시용

            // 사용자가 이미 선택한 알레르기인지 확인
            if (currentUser && currentUser.allergies.includes(koreanFactors[index])) {
                tag.classList.add('selected');
            }

            // 클릭 이벤트 - 토글
            tag.addEventListener('click', function() {
                this.classList.toggle('selected');
            });

            allergieHashsContainer.appendChild(tag);
        });
    } catch (error) {
        console.error('알레르기 요인 로드 실패:', error);
        // 폴백으로 기본 allergyFactors 사용
        const allergieHashsContainer = document.getElementById('allergie-hashs-container');
        allergieHashsContainer.innerHTML = '';

        allergyFactors.forEach(factor => {
            const tag = document.createElement('button');
            tag.className = 'factor-switch';
            tag.textContent = factor;
            tag.dataset.factor = factor;

            if (currentUser && currentUser.allergies.includes(factor)) {
                tag.classList.add('selected');
            }

            tag.addEventListener('click', function() {
                this.classList.toggle('selected');
            });

            allergieHashsContainer.appendChild(tag);
        });
    }
}

// 드래그 앤 드롭 지원
const dropZone = takePicsButton;

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    dropZone.style.color = 'white';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.background = '';
    dropZone.style.color = '';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = '';
    dropZone.style.color = '';

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        selectedImage = files[0];
        nextRun();
    } else {
        showMessage('이미지 파일만 선택 가능합니다.', 'error');
    }
});

// 모바일 카메라 직접 접근 지원
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // 카메라 접근 가능한 경우 추가 옵션 제공
    const cameraOption = document.createElement('input');
    cameraOption.type = 'file';
    cameraOption.accept = 'image/*';
    cameraOption.capture = 'camera';
    cameraOption.style.display = 'none';
    document.body.appendChild(cameraOption);

    // 길게 누르면 카메라 직접 실행
    let pressTimer;
    takePicsButton.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            cameraOption.click();
        }, 1000);
    });

    takePicsButton.addEventListener('touchend', function(e) {
        clearTimeout(pressTimer);
    });

    cameraOption.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            selectedImage = file;
            nextRun();
        }
    });
}

// 분석 함수 (임시 구현)
function consider() {
    // 실제 구현에서는 AI API를 호출합니다
    showMessage('이미지 분석 중...', 'info');

    // 임시로 3초 후 결과 표시
    setTimeout(() => {
        navigateTo('result');
        displayAnalysisResult();
    }, 2000);
}

// 분석 결과 표시
function displayAnalysisResult() {
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text-section');
    const checkedFactors = document.getElementById('checked-factors-output');

    // 임시 결과 (실제로는 AI 분석 결과)
    const mockResult = {
        status: 'warning', // safe, warning, danger
        message: '주의가 필요한 성분이 발견되었습니다.',
        detectedAllergens: ['땅콩', '우유'],
        confidence: 0.85
    };

    resultContainer.className = `result-container ${mockResult.status}`;
    resultText.innerHTML = `
        <p>${mockResult.message}</p>
        <p>신뢰도: ${Math.round(mockResult.confidence * 100)}%</p>
    `;

    checkedFactors.innerHTML = '';
    mockResult.detectedAllergens.forEach(allergen => {
        const tag = document.createElement('span');
        tag.className = 'allergen-tag';
        tag.textContent = `#${allergen}`;
        checkedFactors.appendChild(tag);
    });
}