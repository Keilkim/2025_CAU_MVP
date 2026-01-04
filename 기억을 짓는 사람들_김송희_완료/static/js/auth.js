/**
 * 인증 관련 JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 탭 전환
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 탭 활성화
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 폼 전환
            if (tab.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }

            // 에러 메시지 숨기기
            document.querySelectorAll('.error-message').forEach(el => {
                el.classList.remove('show');
            });
        });
    });

    // 로그인 처리
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('loginError');
        const btn = loginForm.querySelector('button[type="submit"]');

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            showError(errorEl, '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        btn.disabled = true;
        btn.textContent = '로그인 중...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // 로그인 성공 - 프리셋 확인 후 리다이렉트
                await redirectAfterLogin();
            } else {
                showError(errorEl, data.error || '로그인에 실패했습니다.');
                btn.disabled = false;
                btn.textContent = '로그인';
            }
        } catch (error) {
            showError(errorEl, '서버 연결에 실패했습니다.');
            btn.disabled = false;
            btn.textContent = '로그인';
        }
    });

    // 회원가입 처리
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('registerError');
        const btn = registerForm.querySelector('button[type="submit"]');

        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        // 유효성 검사
        if (!username || !password) {
            showError(errorEl, '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        if (username.length < 2) {
            showError(errorEl, '아이디는 2자 이상이어야 합니다.');
            return;
        }

        if (password.length < 4) {
            showError(errorEl, '비밀번호는 4자 이상이어야 합니다.');
            return;
        }

        if (password !== passwordConfirm) {
            showError(errorEl, '비밀번호가 일치하지 않습니다.');
            return;
        }

        btn.disabled = true;
        btn.textContent = '가입 중...';

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // 회원가입 성공 - 신규 사용자이므로 바로 설정 페이지로 이동
                window.location.href = '/settings';
            } else {
                showError(errorEl, data.error || '회원가입에 실패했습니다.');
                btn.disabled = false;
                btn.textContent = '가입하기';
            }
        } catch (error) {
            showError(errorEl, '서버 연결에 실패했습니다.');
            btn.disabled = false;
            btn.textContent = '가입하기';
        }
    });

    // 로그인 후 프리셋 확인하여 리다이렉트
    async function redirectAfterLogin() {
        try {
            const response = await fetch('/api/presets');
            const data = await response.json();

            if (data.count > 0) {
                // 프리셋이 있으면 프리셋 목록 페이지로
                window.location.href = '/presets';
            } else {
                // 프리셋이 없으면 설정 페이지로
                window.location.href = '/settings';
            }
        } catch (error) {
            // 오류 시 기본적으로 설정 페이지로
            window.location.href = '/settings';
        }
    }

    // 에러 메시지 표시
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('show');

        // 5초 후 자동 숨김
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }
});
