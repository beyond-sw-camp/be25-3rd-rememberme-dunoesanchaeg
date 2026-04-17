// src/utils/jwtUtils.js
export const getRoleFromToken = (token) => {
    if (!token) return null;
    try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        return payload.role || payload.auth || null;
    } catch (e) {
        return null;
    }
};

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        return payload.exp < Math.floor(Date.now() / 1000);
    } catch (e) {
        return true;
    }
};