// analysis.js - 제품 사진 분석 기능

// Gemini API 설정 (실제 구현시 백엔드에서 처리해야 함)
const GEMINI_API_KEY = 'AIzaSyC0-TW57YUHAh_3-XjsKLXVmqmMD7hk9AU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

// RAG API 설정 (rag.js에서 import)
const RAG_ENABLED = true; // RAG 기능 활성화 여부

// 제품 성분 데이터베이스 (샘플)
const productDatabase = {
    "snacks": {
        "초코파이": ["밀가루", "계란", "우유", "대두"],
        "새우깡": ["새우", "밀", "대두"],
        "땅콩강정": ["땅콩", "밀가루", "계란"],
        "치즈볼": ["우유", "밀", "대두"]
    },
    "beverages": {
        "우유": ["우유"],
        "두유": ["대두"],
        "아몬드브리즈": ["아몬드"]
    },
    "ingredients": {
        "밀가루": ["밀"],
        "버터": ["우유"],
        "마요네즈": ["계란", "대두"]
    }
};

// 분석 함수 (실제 구현)
async function analyzeImage(imageFile) {
    try {
        // 로딩 표시
        showAnalysisLoading();

        // 이미지를 Base64로 변환
        const base64Image = await convertImageToBase64(imageFile);

        // OCR 및 이미지 분석 시뮬레이션
        // 실제로는 Gemini API 또는 다른 Vision API를 사용
        const analysisResult = await simulateImageAnalysis(base64Image);

        // 알레르기 체크
        const allergyCheckResult = checkForAllergies(analysisResult);

        return allergyCheckResult;
    } catch (error) {
        console.error('Image analysis error:', error);
        showMessage('이미지 분석 중 오류가 발생했습니다.', 'error');
        return null;
    }
}

// 이미지를 Base64로 변환
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 이미지 분석 시뮬레이션 (실제로는 API 호출)
async function simulateImageAnalysis(base64Image) {
    // 2초 대기 (API 호출 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 랜덤하게 제품 선택 (시뮬레이션)
    const products = ["초코파이", "새우깡", "땅콩강정", "치즈볼", "우유", "두유"];
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    // 제품에 따른 성분 반환
    let detectedIngredients = [];
    Object.values(productDatabase).forEach(category => {
        if (category[randomProduct]) {
            detectedIngredients = category[randomProduct];
        }
    });

    return {
        productName: randomProduct,
        ingredients: detectedIngredients,
        confidence: 0.85 + Math.random() * 0.15
    };
}

// Gemini API를 사용한 실제 분석 (주석 처리 - 실제 구현시 사용)
/*
async function analyzeWithGemini(base64Image) {
    const requestBody = {
        contents: [{
            parts: [
                {
                    text: "이 제품 이미지에서 제품명과 성분표를 읽고 알레르기 유발 성분을 찾아주세요. 특히 계란, 우유, 메밀, 땅콩, 대두, 밀, 고등어, 게, 새우, 돼지고기, 복숭아, 토마토, 아황산류, 호두, 닭고기, 쇠고기, 오징어, 조개류, 잣 등이 포함되어 있는지 확인해주세요."
                },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: base64Image
                    }
                }
            ]
        }]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return parseGeminiResponse(data);
}
*/

// 알레르기 체크 (RAG 통합 버전)
function checkForAllergies(analysisResult) {
    if (!currentUser || !currentUser.allergies) {
        return {
            status: 'unknown',
            message: '사용자 알레르기 정보가 없습니다.',
            detectedAllergens: [],
            productInfo: analysisResult,
            ragAnalysis: null
        };
    }

    const userAllergies = currentUser.allergies;
    const detectedAllergens = [];
    let ragAnalysis = null;

    // RAG 기능이 활성화된 경우 RAG 분석 수행
    if (RAG_ENABLED && typeof ragAnalyzeIngredients !== 'undefined') {
        ragAnalysis = ragAnalyzeIngredients(analysisResult.ingredients, userAllergies);

        // RAG 분석 결과에서 위험 성분 추출
        ragAnalysis.risks.forEach(risk => {
            if (!detectedAllergens.includes(risk.allergen)) {
                detectedAllergens.push(risk.allergen);
            }
        });
    } else {
        // 기본 분석 방식 (RAG 없음)
        analysisResult.ingredients.forEach(ingredient => {
            userAllergies.forEach(allergy => {
                if (ingredient.includes(allergy) || allergy.includes(ingredient)) {
                    if (!detectedAllergens.includes(allergy)) {
                        detectedAllergens.push(allergy);
                    }
                }
            });
        });
    }

    // 위험도 판단 (RAG 결과 우선 사용)
    let status, message;
    if (ragAnalysis && ragAnalysis.overallRisk) {
        status = ragAnalysis.overallRisk;
        message = ragAnalysis.summary || generateDefaultMessage(detectedAllergens);
    } else {
        // 기본 위험도 판단
        if (detectedAllergens.length === 0) {
            status = 'safe';
            message = '알레르기 유발 성분이 검출되지 않았습니다.';
        } else if (detectedAllergens.length <= 2) {
            status = 'warning';
            message = `주의: ${detectedAllergens.join(', ')} 성분이 포함되어 있습니다.`;
        } else {
            status = 'danger';
            message = `위험: 다수의 알레르기 유발 성분이 검출되었습니다.`;
        }
    }

    return {
        status,
        message,
        detectedAllergens,
        productInfo: analysisResult,
        confidence: analysisResult.confidence,
        ragAnalysis: ragAnalysis // RAG 분석 결과 포함
    };
}

// 기본 메시지 생성 헬퍼 함수
function generateDefaultMessage(detectedAllergens) {
    if (detectedAllergens.length === 0) {
        return '알레르기 유발 성분이 검출되지 않았습니다.';
    } else if (detectedAllergens.length <= 2) {
        return `주의: ${detectedAllergens.join(', ')} 성분이 포함되어 있습니다.`;
    } else {
        return `위험: 다수의 알레르기 유발 성분이 검출되었습니다.`;
    }
}

// 분석 로딩 표시
function showAnalysisLoading() {
    const showDisplay = document.getElementById('show-display');
    const loadingHTML = `
        <div style="text-align: center; padding: 50px;">
            <div class="loading"></div>
            <p style="margin-top: 20px;">이미지 분석 중...</p>
            <p style="font-size: 12px; color: #999;">AI가 제품 정보를 읽고 있습니다.</p>
        </div>
    `;
    showDisplay.innerHTML = loadingHTML;
}

// 메인 분석 실행 함수
async function consider() {
    if (!selectedImage) {
        showMessage('분석할 이미지가 없습니다.', 'error');
        return;
    }

    if (!currentUser) {
        showMessage('로그인이 필요합니다.', 'error');
        return;
    }

    // 이미지 분석 실행
    const result = await analyzeImage(selectedImage);

    if (result) {
        displayDetailedResult(result);
    }
}

// 상세 결과 표시
function displayDetailedResult(result) {
    navigateTo('result');

    const resultContainer = document.getElementById('Untitled(2)-container');
    const resultText = document.getElementById('result-text-container');
    const aiInterpretation = document.getElementById('ai-interpretation');
    const checkedFactors = document.getElementById('checked-factors-display');

    // 결과 컨테이너 스타일 설정
    resultContainer.className = `result-container ${result.status}`;

    // 결과 텍스트 표시 (RAG 정보 포함)
    let resultHTML = `
        <div class="status-message ${result.status}">
            ${getStatusIcon(result.status)}
            <span>${result.message}</span>
        </div>
        <div class="product-info">
            <p><strong>제품명:</strong> ${result.productInfo.productName || '알 수 없음'}</p>
            <p><strong>검출된 성분:</strong> ${result.productInfo.ingredients.join(', ') || '없음'}</p>
            <p><strong>신뢰도:</strong> ${Math.round(result.confidence * 100)}%</p>
        </div>
    `;

    // RAG 분석 결과가 있는 경우 추가 정보 표시
    if (result.ragAnalysis && result.ragAnalysis.detailedInfo) {
        resultHTML += `
        <div class="rag-analysis">
            <h3 style="margin-top: 15px; color: #667eea;">🤖 AI 상세 분석</h3>
        `;

        if (result.ragAnalysis.risks.length > 0) {
            resultHTML += '<div class="rag-risks"><h4>⚠️ 위험 성분 상세:</h4><ul>';
            result.ragAnalysis.risks.forEach(risk => {
                resultHTML += `
                    <li>
                        <strong>${risk.allergen}</strong> (위험도: ${getRiskLevelText(risk.severity)})<br>
                        <small>${risk.info}</small>
                    </li>
                `;
            });
            resultHTML += '</ul></div>';
        }

        if (result.ragAnalysis.safeIngredients.length > 0) {
            resultHTML += '<div class="rag-safe"><h4>✅ 안전 성분:</h4><ul>';
            result.ragAnalysis.safeIngredients.slice(0, 3).forEach(safe => {
                resultHTML += `<li>${safe.name}</li>`;
            });
            resultHTML += '</ul></div>';
        }

        if (result.ragAnalysis.unknownIngredients.length > 0) {
            resultHTML += `<div class="rag-unknown"><h4>❓ 미확인 성분 (${result.ragAnalysis.unknownIngredients.length}개):</h4><p><small>지식 베이스에 없는 성분입니다. 처음 섭취하는 경우 주의가 필요합니다.</small></p></div>`;
        }

        resultHTML += '</div>';
    }

    aiInterpretation.innerHTML = resultHTML;

    // 결과 페이지 배경색 변경
    const resultHtml = document.getElementById('result-html');
    resultHtml.style.background = result.status === 'safe' ? 'rgba(76, 175, 80, 0.1)' :
                                  result.status === 'warning' ? 'rgba(255, 152, 0, 0.1)' :
                                  'rgba(244, 67, 54, 0.1)';

    // 검출된 알레르기 요인 표시
    checkedFactors.innerHTML = '';
    if (result.detectedAllergens.length > 0) {
        result.detectedAllergens.forEach(allergen => {
            const tag = document.createElement('span');
            tag.className = 'allergen-tag';
            tag.textContent = `#${allergen}`;
            checkedFactors.appendChild(tag);
        });
    } else {
        checkedFactors.innerHTML = '<span style="color: #4caf50;">안전한 제품입니다</span>';
    }

    // 추가 액션 버튼
    addResultActions(result);
}

// 상태 아이콘 가져오기
function getStatusIcon(status) {
    const icons = {
        safe: '✅',
        warning: '⚠️',
        danger: '❌',
        critical: '🚨',
        unknown: '❓'
    };
    return icons[status] || '❓';
}

// 위험 수준 텍스트 변환
function getRiskLevelText(severity) {
    const levels = {
        low: '낮음',
        medium: '중간',
        high: '높음',
        critical: '매우 위험'
    };
    return levels[severity] || '알 수 없음';
}

// 결과 화면 액션 버튼 추가
function addResultActions(result) {
    const actionContainer = document.createElement('div');
    actionContainer.className = 'result-actions';
    actionContainer.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 10px;
    `;

    actionContainer.innerHTML = `
        <button id="save-result-btn" class="btn btn-secondary">결과 저장</button>
        <button id="share-result-btn" class="btn btn-secondary">공유하기</button>
        <button id="new-analysis-btn" class="btn btn-primary">새로운 분석</button>
    `;

    document.getElementById('Untitled(2)-container').appendChild(actionContainer);

    // 이벤트 리스너 추가
    document.getElementById('save-result-btn').addEventListener('click', () => saveAnalysisResult(result));
    document.getElementById('share-result-btn').addEventListener('click', () => shareResult(result));
    document.getElementById('new-analysis-btn').addEventListener('click', () => {
        navigateTo('main');
        selectedImage = null;
        photoInput.value = '';
    });
}

// 분석 결과 저장
function saveAnalysisResult(result) {
    const savedResults = localStorage.getItem('analysisHistory')
        ? JSON.parse(localStorage.getItem('analysisHistory'))
        : [];

    const newResult = {
        ...result,
        userId: currentUser.id,
        timestamp: new Date().toISOString()
    };

    savedResults.push(newResult);
    localStorage.setItem('analysisHistory', JSON.stringify(savedResults));

    showMessage('분석 결과가 저장되었습니다.', 'success');
}

// 결과 공유
function shareResult(result) {
    const shareText = `
AllerAlert 분석 결과
제품: ${result.productInfo.productName}
상태: ${result.status === 'safe' ? '안전' : result.status === 'warning' ? '주의' : '위험'}
${result.detectedAllergens.length > 0 ? `검출된 알레르기: ${result.detectedAllergens.join(', ')}` : ''}
    `.trim();

    if (navigator.share) {
        navigator.share({
            title: 'AllerAlert 분석 결과',
            text: shareText
        });
    } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(shareText);
        showMessage('결과가 클립보드에 복사되었습니다.', 'success');
    }
}