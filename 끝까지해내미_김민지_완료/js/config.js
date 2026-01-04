/**
 * Configuration file for AllerAlert
 * Update API_BASE_URL when deploying to production
 */

// Development configuration
// const API_BASE_URL = 'http://localhost:5000';

// Production configuration for PythonAnywhere
const API_BASE_URL = 'https://www.hipd.ai.kr';

// API Endpoints
const API_ENDPOINTS = {
    // Authentication
    register: `${API_BASE_URL}/api/register`,
    login: `${API_BASE_URL}/api/login`,

    // Allergies
    getAllergies: (userId) => `${API_BASE_URL}/api/allergies/${userId}`,
    saveAllergies: (userId) => `${API_BASE_URL}/api/allergies/${userId}`,
    updateAllergies: (userId) => `${API_BASE_URL}/api/allergies/${userId}`,

    // Analysis
    analyze: `${API_BASE_URL}/api/analyze`,
    getHistory: (userId) => `${API_BASE_URL}/api/history/${userId}`,

    // Data
    allergyFactors: `${API_BASE_URL}/api/allergy-factors`,

    // Static files (if needed)
    staticUrl: (path) => `${API_BASE_URL}/statics/${path}`
};

// Helper function for API calls with error handling
async function apiCall(url, options = {}) {
    try {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for session management
        };

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_BASE_URL, API_ENDPOINTS, apiCall };
}