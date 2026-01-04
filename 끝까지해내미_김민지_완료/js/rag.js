// rag.js - RAG (Retrieval Augmented Generation) API 기능

// RAG API 설정
const RAG_API_KEY = 'YOUR_RAG_API_KEY_HERE'; // 실제 RAG API 키로 교체 필요
const RAG_API_URL = 'https://api.openai.com/v1/embeddings'; // 또는 다른 RAG 서비스 URL

// 알레르기 관련 지식 베이스
const allergyKnowledgeBase = [
    {
        id: 1,
        category: '계란',
        info: '계란 알레르기는 난백 단백질에 대한 면역 반응입니다. 레시틴, 알부민, 리소자임 등의 성분에도 주의가 필요합니다.',
        relatedIngredients: ['난백', '난황', '레시틴', '알부민', '리소자임', '마요네즈'],
        severity: 'high'
    },
    {
        id: 2,
        category: '우유',
        info: '우유 알레르기는 카제인, 유청 단백질에 대한 반응입니다. 유제품 전반에 주의가 필요합니다.',
        relatedIngredients: ['카제인', '유청', '락토스', '버터', '치즈', '요거트', '크림'],
        severity: 'high'
    },
    {
        id: 3,
        category: '땅콩',
        info: '땅콩 알레르기는 가장 심각한 알레르기 중 하나로 아나필락시스를 유발할 수 있습니다.',
        relatedIngredients: ['땅콩버터', '땅콩유', '피넛', 'peanut'],
        severity: 'critical'
    },
    {
        id: 4,
        category: '대두',
        info: '대두(콩) 알레르기는 두부, 된장, 간장 등 콩 제품 전반에 영향을 미칩니다.',
        relatedIngredients: ['콩', '두부', '된장', '간장', '대두유', '레시틴'],
        severity: 'medium'
    },
    {
        id: 5,
        category: '밀',
        info: '밀 알레르기는 글루텐 단백질에 대한 반응으로 빵, 면, 과자류에 주의가 필요합니다.',
        relatedIngredients: ['밀가루', '글루텐', '빵', '파스타', '면', '케이크'],
        severity: 'high'
    },
    {
        id: 6,
        category: '새우',
        info: '갑각류 알레르기는 새우, 게, 랍스터 등에 교차 반응을 일으킬 수 있습니다.',
        relatedIngredients: ['새우', '게', '랍스터', '가재', '갑각류 추출물'],
        severity: 'high'
    },
    {
        id: 7,
        category: '고등어',
        info: '생선 알레르기는 다양한 어류에 교차 반응을 일으킬 수 있습니다.',
        relatedIngredients: ['고등어', '참치', '연어', '생선 추출물', '어육'],
        severity: 'medium'
    },
    {
        id: 8,
        category: '아황산류',
        info: '아황산류는 식품 보존제로 사용되며 천식 환자에게 특히 위험할 수 있습니다.',
        relatedIngredients: ['이산화황', '아황산나트륨', '메타중아황산'],
        severity: 'high'
    },
    {
        id: 9,
        category: '호두',
        info: '견과류 알레르기는 다른 견과류에도 교차 반응을 일으킬 수 있습니다.',
        relatedIngredients: ['호두', '아몬드', '피칸', '캐슈넛', '견과류'],
        severity: 'high'
    },
    {
        id: 10,
        category: '토마토',
        info: '토마토 알레르기는 가지과 식물에 교차 반응을 일으킬 수 있습니다.',
        relatedIngredients: ['토마토', '케첩', '토마토소스', '가지', '감자'],
        severity: 'low'
    }
];

/**
 * RAG 기반 알레르기 정보 검색
 * @param {string} query - 검색 쿼리 (성분명 또는 제품명)
 * @param {Array} userAllergies - 사용자의 알레르기 목록
 * @returns {Object} - 관련 정보 및 위험도
 */
function ragSearch(query, userAllergies = []) {
    const results = {
        matches: [],
        risks: [],
        recommendations: []
    };

    // 쿼리를 소문자로 변환
    const normalizedQuery = query.toLowerCase();

    // 지식 베이스에서 관련 정보 검색
    allergyKnowledgeBase.forEach(item => {
        // 카테고리 또는 관련 성분에 쿼리가 포함되는지 확인
        const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
        const ingredientMatch = item.relatedIngredients.some(ing =>
            ing.toLowerCase().includes(normalizedQuery) ||
            normalizedQuery.includes(ing.toLowerCase())
        );

        if (categoryMatch || ingredientMatch) {
            results.matches.push(item);

            // 사용자 알레르기와 매칭 확인
            if (userAllergies.includes(item.category)) {
                results.risks.push({
                    allergen: item.category,
                    severity: item.severity,
                    info: item.info,
                    detectedIn: query
                });
            }
        }
    });

    // 추천 사항 생성
    if (results.risks.length > 0) {
        results.recommendations.push('이 제품은 귀하의 알레르기 유발 성분을 포함하고 있습니다.');
        results.recommendations.push('섭취 전 반드시 의사와 상담하세요.');

        // 심각도에 따른 경고
        const criticalRisks = results.risks.filter(r => r.severity === 'critical');
        if (criticalRisks.length > 0) {
            results.recommendations.push('⚠️ 치명적인 알레르기 위험이 있습니다. 절대 섭취하지 마세요!');
        }
    } else if (results.matches.length > 0) {
        results.recommendations.push('해당 성분이 포함되어 있으나 귀하의 알레르기 목록에는 없습니다.');
        results.recommendations.push('처음 섭취하는 경우 소량으로 시작하세요.');
    }

    return results;
}

/**
 * 여러 성분에 대한 종합 RAG 분석
 * @param {Array} ingredients - 제품 성분 목록
 * @param {Array} userAllergies - 사용자 알레르기 목록
 * @returns {Object} - 종합 분석 결과
 */
function ragAnalyzeIngredients(ingredients, userAllergies = []) {
    const analysis = {
        totalIngredients: ingredients.length,
        checkedCount: 0,
        risks: [],
        safeIngredients: [],
        unknownIngredients: [],
        overallRisk: 'safe', // safe, warning, danger, critical
        detailedInfo: []
    };

    ingredients.forEach(ingredient => {
        const searchResult = ragSearch(ingredient, userAllergies);

        if (searchResult.risks.length > 0) {
            // 위험 성분 발견
            analysis.risks.push(...searchResult.risks);
            analysis.checkedCount++;
        } else if (searchResult.matches.length > 0) {
            // 알려진 성분이지만 사용자 알레르기와는 무관
            analysis.safeIngredients.push({
                name: ingredient,
                info: searchResult.matches[0].info
            });
            analysis.checkedCount++;
        } else {
            // 지식 베이스에 없는 성분
            analysis.unknownIngredients.push(ingredient);
        }

        // 상세 정보 추가
        if (searchResult.matches.length > 0) {
            analysis.detailedInfo.push({
                ingredient: ingredient,
                matches: searchResult.matches,
                recommendations: searchResult.recommendations
            });
        }
    });

    // 전체 위험도 판정
    if (analysis.risks.length > 0) {
        const severities = analysis.risks.map(r => r.severity);
        if (severities.includes('critical')) {
            analysis.overallRisk = 'critical';
        } else if (severities.includes('high')) {
            analysis.overallRisk = 'danger';
        } else {
            analysis.overallRisk = 'warning';
        }
    }

    return analysis;
}

/**
 * RAG 기반 제품 전체 분석 (Gemini API와 통합)
 * @param {string} productName - 제품명
 * @param {Array} ingredients - 성분 목록
 * @param {Array} userAllergies - 사용자 알레르기 목록
 * @returns {Object} - 종합 분석 결과
 */
async function ragFullAnalysis(productName, ingredients, userAllergies = []) {
    console.log('RAG 전체 분석 시작:', { productName, ingredients, userAllergies });

    // 1. RAG 기반 성분 분석
    const ingredientAnalysis = ragAnalyzeIngredients(ingredients, userAllergies);

    // 2. 제품명 기반 추가 정보 검색
    const productSearch = ragSearch(productName, userAllergies);

    // 3. 상세 리포트 생성
    const report = {
        productName: productName,
        analysisTimestamp: new Date().toISOString(),
        ingredientAnalysis: ingredientAnalysis,
        productRelatedInfo: productSearch,
        summary: generateAnalysisSummary(ingredientAnalysis, productSearch),
        actionable: generateActionableAdvice(ingredientAnalysis)
    };

    console.log('RAG 분석 완료:', report);
    return report;
}

/**
 * 분석 요약 생성
 */
function generateAnalysisSummary(ingredientAnalysis, productSearch) {
    const summary = [];

    if (ingredientAnalysis.overallRisk === 'critical') {
        summary.push('🔴 치명적 위험: 이 제품은 심각한 알레르기 반응을 일으킬 수 있습니다.');
    } else if (ingredientAnalysis.overallRisk === 'danger') {
        summary.push('🔴 높은 위험: 이 제품은 알레르기 반응을 일으킬 가능성이 높습니다.');
    } else if (ingredientAnalysis.overallRisk === 'warning') {
        summary.push('🟡 주의 필요: 일부 알레르기 유발 성분이 포함되어 있습니다.');
    } else {
        summary.push('🟢 안전: 알려진 알레르기 유발 성분이 검출되지 않았습니다.');
    }

    summary.push(`총 ${ingredientAnalysis.totalIngredients}개 성분 중 ${ingredientAnalysis.checkedCount}개 확인됨`);

    if (ingredientAnalysis.risks.length > 0) {
        summary.push(`검출된 알레르기 성분: ${ingredientAnalysis.risks.map(r => r.allergen).join(', ')}`);
    }

    if (ingredientAnalysis.unknownIngredients.length > 0) {
        summary.push(`미확인 성분 ${ingredientAnalysis.unknownIngredients.length}개`);
    }

    return summary.join('\n');
}

/**
 * 실행 가능한 조언 생성
 */
function generateActionableAdvice(ingredientAnalysis) {
    const advice = [];

    if (ingredientAnalysis.overallRisk === 'critical' || ingredientAnalysis.overallRisk === 'danger') {
        advice.push('❌ 이 제품을 섭취하지 마세요');
        advice.push('📞 의사와 상담하여 대체 제품을 찾으세요');
        advice.push('💊 항히스타민제를 준비해두세요');
    } else if (ingredientAnalysis.overallRisk === 'warning') {
        advice.push('⚠️ 소량으로 시작하세요');
        advice.push('👁️ 섭취 후 증상을 주의깊게 관찰하세요');
        advice.push('📱 응급 연락처를 준비해두세요');
    } else {
        advice.push('✅ 섭취 가능한 것으로 보입니다');
        advice.push('💡 처음 먹는 제품이라면 소량으로 테스트하세요');
    }

    return advice;
}

/**
 * 성분명 정규화 (다양한 표기 통합)
 */
function normalizeIngredientName(ingredient) {
    const normalizations = {
        '달걀': '계란',
        'egg': '계란',
        'milk': '우유',
        'soy': '대두',
        'wheat': '밀',
        'shrimp': '새우',
        'crab': '게',
        'peanut': '땅콩',
        'walnut': '호두',
        'peach': '복숭아'
    };

    const lower = ingredient.toLowerCase();
    return normalizations[lower] || ingredient;
}

/**
 * RAG 지식 베이스 확장 함수
 */
function addToKnowledgeBase(category, info, relatedIngredients, severity) {
    allergyKnowledgeBase.push({
        id: allergyKnowledgeBase.length + 1,
        category: category,
        info: info,
        relatedIngredients: relatedIngredients,
        severity: severity
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ragSearch,
        ragAnalyzeIngredients,
        ragFullAnalysis,
        normalizeIngredientName,
        addToKnowledgeBase,
        allergyKnowledgeBase
    };
}
