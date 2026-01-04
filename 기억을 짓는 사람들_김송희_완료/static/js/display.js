/**
 * 테라피 디스플레이 JavaScript
 * v4 - 재생 버튼 누를 때만 모든 전환 시작
 */
console.log('=== display.js v4 로드됨 ===');

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== 초기 상태: 모든 전환 비활성화 ===');
    // ============ 상태 관리 ============
    let settings = {
        colors: ['#87CEEB', '#98D8C8', '#E6E6FA'], // 기본 색상
        music_mood: null,
        memory_type: null
    };
    let currentColorIndex = 0;
    let colorInterval = null;
    let controlBarTimeout = null;
    let isPlaying = false;
    let musicList = [];
    let currentMusicIndex = 0;
    let photoList = [];
    let currentPhotoIndex = 0;
    let slideshowInterval = null;

    // ============ 분위기별 설정값 ============
    const MOOD_CONFIGS = {
        calm: { slideshowInterval: 8000, colorInterval: 8000 },
        energetic: { slideshowInterval: 3000, colorInterval: 3000 },
        nostalgic: { slideshowInterval: 6000, colorInterval: 6000 },
        nature: { slideshowInterval: 5000, colorInterval: 5000 }
    };
    const DEFAULT_CONFIG = { slideshowInterval: 5000, colorInterval: 5000 };

    // 현재 분위기 설정 가져오기
    function getMoodConfig() {
        return MOOD_CONFIGS[settings.music_mood] || DEFAULT_CONFIG;
    }

    // 분위기/테마 클래스 적용
    function applyMoodAndTheme() {
        const container = document.querySelector('.display-container');

        // 기존 분위기/테마 클래스 제거
        container.classList.forEach(cls => {
            if (cls.startsWith('mood-') || cls.startsWith('memory-')) {
                container.classList.remove(cls);
            }
        });

        // 음악 분위기 클래스 적용
        if (settings.music_mood) {
            container.classList.add(`mood-${settings.music_mood}`);
        }

        // 기억 유형 클래스 적용
        if (settings.memory_type) {
            container.classList.add(`memory-${settings.memory_type}`);
        }
    }

    // ============ DOM 요소 ============
    const gradientBg = document.getElementById('gradientBg');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
    const controlBar = document.getElementById('controlBar');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentTrack = document.getElementById('currentTrack');
    const mediaBtn = document.getElementById('mediaBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const controlRight = document.querySelector('.control-right');
    const sidePanel = document.getElementById('sidePanel');
    const closePanel = document.getElementById('closePanel');
    const panelTabs = document.querySelectorAll('.panel-tab');
    const photosTab = document.getElementById('photosTab');
    const musicTab = document.getElementById('musicTab');
    const photoUploadArea = document.getElementById('photoUploadArea');
    const photoInput = document.getElementById('photoInput');
    const photoGrid = document.getElementById('photoGrid');
    const musicUploadArea = document.getElementById('musicUploadArea');
    const musicInput = document.getElementById('musicInput');
    const musicListEl = document.getElementById('musicList');
    const slideshowImage = document.getElementById('slideshowImage');
    const colorFilterOverlay = document.getElementById('colorFilterOverlay');
    const audioPlayer = document.getElementById('audioPlayer');

    // ============ 초기화 ============
    init();

    async function init() {
        await loadSettings();
        await loadMedia();
        applyMoodAndTheme();

        // 초기 상태: 필터 투명 (재생 시 색상 적용)
        gradientBg.style.backgroundColor = 'transparent';
        if (colorFilterOverlay) colorFilterOverlay.style.backgroundColor = 'transparent';

        setupEventListeners();
        showControlBar();

        // 사진이 있으면 첫 번째 사진만 표시 (재생 전까지 자동 전환 안함)
        if (photoList.length > 0) {
            showSlideshow(0);
        }
    }

    // ============ 설정 불러오기 ============
    async function loadSettings() {
        try {
            // 세션 스토리지에서 선택된 프리셋 ID 가져오기
            const presetId = sessionStorage.getItem('selectedPresetId');

            if (presetId) {
                // 특정 프리셋 불러오기
                const response = await fetch(`/api/presets/${presetId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.colors && data.colors.length > 0) {
                        settings.colors = data.colors;
                    }
                    settings.music_mood = data.music_mood;
                    settings.memory_type = data.memory_type;
                    return;
                }
            }

            // 프리셋이 없거나 로드 실패 시 첫 번째 프리셋 사용
            const response = await fetch('/api/presets');
            const data = await response.json();
            if (data.presets && data.presets.length > 0) {
                const preset = data.presets[0];
                if (preset.colors && preset.colors.length > 0) {
                    settings.colors = preset.colors;
                }
                settings.music_mood = preset.music_mood;
                settings.memory_type = preset.memory_type;
            }
        } catch (error) {
            console.error('설정 불러오기 실패:', error);
        }
    }

    // ============ 색상 그라데이션 ============
    function startColorTransition() {
        // 초기 색상 설정
        updateBackgroundColor();

        // 분위기에 따른 색상 전환 속도
        const config = getMoodConfig();
        colorInterval = setInterval(() => {
            currentColorIndex = (currentColorIndex + 1) % settings.colors.length;
            updateBackgroundColor();
        }, config.colorInterval);
    }

    function updateBackgroundColor() {
        const color = settings.colors[currentColorIndex];

        // 배경 단색 (transition으로 부드럽게 전환)
        gradientBg.style.backgroundColor = color;

        // 슬라이드쇼 컬러 필터 오버레이 업데이트 (단색으로 부드럽게)
        if (colorFilterOverlay) {
            colorFilterOverlay.style.backgroundColor = color;
        }
    }

    // ============ 전체화면 ============
    // 전체화면 버튼 (컨트롤바) - 전체화면 토글
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('전체화면 전환 실패:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // 전체화면 종료 버튼 (우측 상단) - 전체화면 해제
    exitFullscreenBtn.addEventListener('click', () => {
        document.exitFullscreen();
    });

    // 전체화면 상태 변경 감지
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            // 전체화면 진입 시 종료 버튼 표시 + 버튼 아이콘 변경
            exitFullscreenBtn.classList.remove('hidden');
            fullscreenBtn.innerHTML = '⊟';  // 축소 아이콘
            fullscreenBtn.title = '전체화면 종료';
        } else {
            // 전체화면 해제 시 종료 버튼 숨김 + 버튼 아이콘 복원
            exitFullscreenBtn.classList.add('hidden');
            fullscreenBtn.innerHTML = '⛶';  // 전체화면 아이콘
            fullscreenBtn.title = '전체화면';
        }
    });

    // ============ 컨트롤 바 표시/숨김 ============
    function showControlBar() {
        controlBar.classList.add('show');
        resetControlBarTimeout();
    }

    function hideControlBar() {
        if (!sidePanel.classList.contains('show')) {
            controlBar.classList.remove('show');
        }
    }

    function resetControlBarTimeout() {
        clearTimeout(controlBarTimeout);
        controlBarTimeout = setTimeout(hideControlBar, 3000);
    }

    // 화면 터치/클릭 시 컨트롤 바 표시
    gradientBg.addEventListener('click', showControlBar);
    gradientBg.addEventListener('touchstart', showControlBar);

    // 컨트롤 바 위에서는 자동 숨김 방지
    controlBar.addEventListener('mouseenter', () => clearTimeout(controlBarTimeout));
    controlBar.addEventListener('mouseleave', resetControlBarTimeout);

    // ============ 오디오 컨트롤 ============
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    volumeSlider.addEventListener('input', updateVolume);

    audioPlayer.addEventListener('ended', playNext);
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        const config = getMoodConfig();

        // 음악 재생 시 첫 번째 색상 서서히 적용
        updateBackgroundColor();

        // 음악 재생 시 사진 슬라이드쇼 자동 전환 시작
        if (photoList.length > 0 && !slideshowInterval) {
            slideshowInterval = setInterval(() => {
                currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
                updateSlideshowImage(true);
            }, config.slideshowInterval);
        }
        // 음악 재생 시 색상 전환 시작
        if (!colorInterval) {
            colorInterval = setInterval(() => {
                currentColorIndex = (currentColorIndex + 1) % settings.colors.length;
                updateBackgroundColor();
            }, config.colorInterval);
        }
    });
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        // 음악 일시정지 시 슬라이드쇼 자동 전환 정지
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        // 음악 일시정지 시 색상 전환도 정지
        clearInterval(colorInterval);
        colorInterval = null;
    });

    function togglePlay() {
        if (musicList.length === 0) {
            alert('먼저 음악을 업로드해주세요.');
            openPanel('music');
            return;
        }

        if (isPlaying) {
            audioPlayer.pause();
        } else {
            if (!audioPlayer.src) {
                loadMusic(0);
            }
            audioPlayer.play();
        }
    }

    function playPrevious() {
        if (musicList.length === 0) return;
        currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
        loadMusic(currentMusicIndex);
        audioPlayer.play();
    }

    function playNext() {
        if (musicList.length === 0) return;
        currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
        loadMusic(currentMusicIndex);
        audioPlayer.play();
    }

    function loadMusic(index) {
        if (musicList.length === 0) return;
        const music = musicList[index];
        audioPlayer.src = music.url;
        currentTrack.textContent = music.original_name;
        updateMusicListUI();
    }

    function updateVolume() {
        audioPlayer.volume = volumeSlider.value / 100;
    }

    // ============ 사이드 패널 ============
    mediaBtn.addEventListener('click', () => openPanel('photos'));
    closePanel.addEventListener('click', closePanelFn);
    settingsBtn.addEventListener('click', () => {
        window.location.href = '/presets';
    });

    panelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            panelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (tab.dataset.tab === 'photos') {
                photosTab.classList.remove('hidden');
                musicTab.classList.add('hidden');
            } else {
                photosTab.classList.add('hidden');
                musicTab.classList.remove('hidden');
            }
        });
    });

    function openPanel(tab = 'photos') {
        sidePanel.classList.add('show');
        controlRight.style.display = 'none'; // 오른쪽 컨트롤 영역 숨김
        panelTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        if (tab === 'photos') {
            photosTab.classList.remove('hidden');
            musicTab.classList.add('hidden');
        } else {
            photosTab.classList.add('hidden');
            musicTab.classList.remove('hidden');
        }
        showControlBar();
    }

    function closePanelFn() {
        sidePanel.classList.remove('show');
        controlRight.style.display = 'flex'; // 오른쪽 컨트롤 영역 다시 표시
        resetControlBarTimeout();
    }

    // ============ 파일 업로드 ============
    // 사진 업로드
    photoUploadArea.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);

    photoUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoUploadArea.style.borderColor = '#4A90A4';
    });
    photoUploadArea.addEventListener('dragleave', () => {
        photoUploadArea.style.borderColor = '';
    });
    photoUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        photoUploadArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        uploadPhotos(files);
    });

    // 음악 업로드
    musicUploadArea.addEventListener('click', () => musicInput.click());
    musicInput.addEventListener('change', handleMusicUpload);

    musicUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        musicUploadArea.style.borderColor = '#4A90A4';
    });
    musicUploadArea.addEventListener('dragleave', () => {
        musicUploadArea.style.borderColor = '';
    });
    musicUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        musicUploadArea.style.borderColor = '';
        const files = e.dataTransfer.files;
        uploadMusic(files);
    });

    async function handlePhotoUpload(e) {
        const files = e.target.files;
        await uploadPhotos(files);
        photoInput.value = '';
    }

    async function handleMusicUpload(e) {
        const files = e.target.files;
        await uploadMusic(files);
        musicInput.value = '';
    }

    async function uploadPhotos(files) {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload/photo', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    photoList.unshift(data.media);
                    renderPhotoGrid();
                } else {
                    alert(data.error || '업로드 실패');
                }
            } catch (error) {
                alert('업로드 중 오류가 발생했습니다.');
            }
        }
    }

    async function uploadMusic(files) {
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload/music', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    musicList.unshift(data.media);
                    renderMusicList();
                    if (musicList.length === 1) {
                        loadMusic(0);
                    }
                } else {
                    alert(data.error || '업로드 실패');
                }
            } catch (error) {
                alert('업로드 중 오류가 발생했습니다.');
            }
        }
    }

    // ============ 미디어 불러오기 ============
    async function loadMedia() {
        try {
            const response = await fetch('/api/media');
            const data = await response.json();

            photoList = data.media.filter(m => m.type === 'photo');
            musicList = data.media.filter(m => m.type === 'music');

            renderPhotoGrid();
            renderMusicList();

            if (musicList.length > 0) {
                loadMusic(0);
            }
        } catch (error) {
            console.error('미디어 불러오기 실패:', error);
        }
    }

    function renderPhotoGrid() {
        photoGrid.innerHTML = '';
        photoList.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'media-item';
            item.innerHTML = `
                <img src="${photo.url}" alt="${photo.original_name}">
                <button class="delete-btn" data-id="${photo.id}">✕</button>
            `;
            item.querySelector('img').addEventListener('click', () => {
                showSlideshow(index);
                // 사진 클릭 시 음악도 재생
                if (musicList.length > 0 && !isPlaying) {
                    if (!audioPlayer.src) {
                        loadMusic(0);
                    }
                    audioPlayer.play();
                }
            });
            item.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMedia(photo.id, 'photo');
            });
            photoGrid.appendChild(item);
        });
    }

    function renderMusicList() {
        musicListEl.innerHTML = '';
        if (musicList.length === 0) {
            musicListEl.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center;">음악이 없습니다</p>';
            currentTrack.textContent = '음악을 업로드해주세요';
            return;
        }

        musicList.forEach((music, index) => {
            const item = document.createElement('div');
            item.className = 'music-item' + (index === currentMusicIndex ? ' playing' : '');
            item.innerHTML = `
                <span class="music-icon">♪</span>
                <span class="music-name">${music.original_name}</span>
                <button class="delete-btn" data-id="${music.id}" style="position:static; opacity:1; background:rgba(255,0,0,0.5); width:25px; height:25px; border-radius:50%; border:none; color:white; cursor:pointer;">✕</button>
            `;
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) return;
                currentMusicIndex = index;
                loadMusic(index);
                audioPlayer.play();
            });
            item.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMedia(music.id, 'music');
            });
            musicListEl.appendChild(item);
        });
    }

    function updateMusicListUI() {
        document.querySelectorAll('.music-item').forEach((item, index) => {
            item.classList.toggle('playing', index === currentMusicIndex);
        });
    }

    async function deleteMedia(id, type) {
        if (!confirm('삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (data.success) {
                if (type === 'photo') {
                    photoList = photoList.filter(p => p.id !== id);
                    renderPhotoGrid();
                } else {
                    const wasPlaying = musicList[currentMusicIndex]?.id === id;
                    musicList = musicList.filter(m => m.id !== id);
                    if (wasPlaying) {
                        audioPlayer.pause();
                        audioPlayer.src = '';
                        currentMusicIndex = 0;
                        if (musicList.length > 0) {
                            loadMusic(0);
                        }
                    }
                    renderMusicList();
                }
            }
        } catch (error) {
            alert('삭제 실패');
        }
    }

    // ============ 사진 슬라이드쇼 (메인 화면 인라인) ============

    // 슬라이드쇼 표시 (메인 화면에서) - 이미지만 표시, 자동 전환은 재생 버튼에서만
    function showSlideshow(index) {
        if (photoList.length === 0) return;

        currentPhotoIndex = index;
        updateSlideshowImage(false); // 첫 이미지는 애니메이션 없이
        slideshowImage.classList.remove('hidden');
    }

    // 슬라이드쇼 숨기기
    function hideSlideshow() {
        clearInterval(slideshowInterval);
        slideshowImage.classList.add('hidden');
    }

    // 전환 애니메이션 시간 (ms)
    const TRANSITION_DURATIONS = {
        calm: 1500,
        energetic: 400,
        nostalgic: 1000,
        nature: 800
    };

    function getTransitionDuration() {
        return TRANSITION_DURATIONS[settings.music_mood] || 500;
    }

    function updateSlideshowImage(animate = true) {
        if (photoList.length === 0) return;

        if (animate && slideshowImage.src) {
            // 나가는 애니메이션 적용
            slideshowImage.classList.add('transitioning-out');

            const duration = getTransitionDuration();
            setTimeout(() => {
                // 이미지 변경
                slideshowImage.src = photoList[currentPhotoIndex].url;
                slideshowImage.classList.remove('transitioning-out');
            }, duration);
        } else {
            // 첫 이미지는 애니메이션 없이 바로 표시
            slideshowImage.src = photoList[currentPhotoIndex].url;
        }
    }

    // 슬라이드쇼에서 좌우 클릭으로 전환 (수동 전환만, 자동 전환은 재생 중일 때만)
    slideshowImage.addEventListener('click', (e) => {
        if (slideshowImage.classList.contains('hidden')) return;

        const rect = slideshowImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            // 왼쪽 클릭 - 이전
            currentPhotoIndex = (currentPhotoIndex - 1 + photoList.length) % photoList.length;
        } else {
            // 오른쪽 클릭 - 다음
            currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
        }
        updateSlideshowImage(true); // 애니메이션 적용

        // 재생 중일 때만 타이머 리셋
        if (isPlaying) {
            clearInterval(slideshowInterval);
            const config = getMoodConfig();
            slideshowInterval = setInterval(() => {
                currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
                updateSlideshowImage(true);
            }, config.slideshowInterval);
        }
    });

    // ============ 키보드 단축키 ============
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowRight':
                playNext();
                break;
            case 'ArrowLeft':
                playPrevious();
                break;
            case 'f':
            case 'F':
                // 전체화면 토글
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen();
                }
                break;
            case 'Escape':
                if (sidePanel.classList.contains('show')) {
                    closePanelFn();
                }
                break;
        }
    });

    // ============ 이벤트 리스너 설정 ============
    function setupEventListeners() {
        // 초기 볼륨 설정
        audioPlayer.volume = volumeSlider.value / 100;
    }
});
