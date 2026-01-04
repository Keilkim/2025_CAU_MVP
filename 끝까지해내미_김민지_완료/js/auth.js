// auth.js - 인증 관련 기능

// 사용자 정보 저장소
let userDatabase = localStorage.getItem('userDatabase')
    ? JSON.parse(localStorage.getItem('userDatabase'))
    : {};

let currentUser = null;
let currentLanguage = 'ko';
let languageData = {};

// DOM 요소
const loginPage = document.getElementById('allergie-html');
const mainPage = document.getElementById('main-container');
const registLightbox = document.getElementById('regist-light-box-container');

// 로그인 관련 요소
const idInput = document.getElementById('id-text-field');
const pwActualInput = document.getElementById('pw-actual-input');
const loginButton = document.getElementById('login-run-touch-button');
const registButton = document.getElementById('regist-touch-button');
const korButton = document.getElementById('kor-touch-button');
const engButton = document.getElementById('eng-touch-button');

// 회원가입 관련 요소
const registId = document.getElementById('regist-id');
const registPw = document.getElementById('regist-pw');
const registPwConfirm = document.getElementById('regist-pw-confirm');
const registSubmit = document.getElementById('regist-submit');
const closeLightbox = document.querySelector('.close-btn');

// 로그인 처리 함수
function checkUser(userId, password) {
    if (!userId || !password) {
        showMessage('아이디와 비밀번호를 입력해주세요.', 'error');
        return false;
    }

    if (userDatabase[userId] && userDatabase[userId].password === password) {
        currentUser = {
            id: userId,
            name: userDatabase[userId].name || userId,
            allergies: userDatabase[userId].allergies || []
        };

        // 세션 스토리지에 현재 사용자 저장
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        return true;
    } else {
        showMessage('아이디 또는 비밀번호가 일치하지 않습니다.', 'error');
        return false;
    }
}

// 회원가입 처리 함수
function registerUser(userId, password) {
    if (userDatabase[userId]) {
        showMessage('이미 존재하는 아이디입니다.', 'error');
        return false;
    }

    userDatabase[userId] = {
        password: password,
        name: userId,
        allergies: [],
        createdAt: new Date().toISOString()
    };

    // 로컬 스토리지에 저장
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
    showMessage('회원가입이 완료되었습니다!', 'success');
    return true;
}

// 언어 데이터 로드
async function loadLanguageData() {
    try {
        const response = await fetch('data/language.json');
        languageData = await response.json();
        applyLanguage(currentLanguage);
    } catch (error) {
        console.error('언어 데이터 로드 실패:', error);
    }
}

// 언어 적용 함수
function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);

    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (languageData[lang] && languageData[lang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = languageData[lang][key];
            } else {
                element.textContent = languageData[lang][key];
            }
        }
    });

    // 언어 버튼 활성화 상태 업데이트
    korButton.classList.toggle('active', lang === 'ko');
    engButton.classList.toggle('active', lang === 'en');
}

// 언어 선택 이벤트
korButton.addEventListener('click', () => applyLanguage('ko'));
engButton.addEventListener('click', () => applyLanguage('en'));

// 로그인 버튼 클릭 이벤트
loginButton.addEventListener('click', function() {
    const userId = idInput.value.trim();
    const password = pwActualInput.value.trim();

    if (checkUser(userId, password)) {
        // 로그인 성공
        switchPage(loginPage, mainPage);
        updateUserInterface();
        loadUserAllergies();
    }
});

// 엔터키로 로그인
pwActualInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginButton.click();
    }
});

// 회원가입 버튼 클릭 이벤트
registButton.addEventListener('click', function() {
    registLightbox.classList.add('active');
    registId.value = '';
    registPw.value = '';
    registPwConfirm.value = '';
});

// 회원가입 제출
registSubmit.addEventListener('click', function() {
    const userId = registId.value.trim();
    const password = registPw.value;
    const passwordConfirm = registPwConfirm.value;

    // 유효성 검사
    if (!userId || !password) {
        showMessage('아이디와 비밀번호를 입력해주세요.', 'error');
        return;
    }

    if (userId.length < 4) {
        showMessage('아이디는 4자 이상이어야 합니다.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('비밀번호는 6자 이상이어야 합니다.', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        showMessage('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }

    if (registerUser(userId, password)) {
        registLightbox.classList.remove('active');
    }
});

// 라이트박스 닫기
closeLightbox.addEventListener('click', function() {
    registLightbox.classList.remove('active');
});

// 라이트박스 외부 클릭시 닫기
registLightbox.addEventListener('click', function(e) {
    if (e.target === registLightbox) {
        registLightbox.classList.remove('active');
    }
});

// 사용자 인터페이스 업데이트
function updateUserInterface() {
    const userNameDisplay = document.getElementById('user-name-display');
    if (currentUser) {
        userNameDisplay.textContent = `안녕하세요, ${currentUser.name}님!`;
    }
}

// 로그아웃 함수
function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    switchPage(mainPage, loginPage);
    idInput.value = '';
    pwInput.value = '';
}

// 페이지 전환 함수
function switchPage(fromPage, toPage) {
    fromPage.classList.remove('active');
    toPage.classList.add('active');
}

// 메시지 표시 함수
function showMessage(message, type = 'info') {
    // 임시 메시지 요소 생성
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#f44336' : '#4caf50'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(messageEl);

    // 3초 후 제거
    setTimeout(() => {
        messageEl.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
    }
`;
document.head.appendChild(style);

// 세션 확인 (페이지 로드시)
window.addEventListener('load', function() {
    // 언어 데이터 로드
    const savedLang = localStorage.getItem('selectedLanguage') || 'ko';
    currentLanguage = savedLang;
    loadLanguageData();

    // 사용자 세션 확인
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        switchPage(loginPage, mainPage);
        updateUserInterface();
        loadUserAllergies();
    }
});

// 사용자 알레르기 정보 불러오기
function loadUserAllergies() {
    if (currentUser && userDatabase[currentUser.id]) {
        currentUser.allergies = userDatabase[currentUser.id].allergies || [];
    }
}