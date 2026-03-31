// src/utils/jwtUtils.ts
export const getRoleFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
        const base64Payload = token.split('.')[1]; // 페이로드 부분 추출
        const payload = JSON.parse(atob(base64Payload));
        return payload.role;
    } catch (e) {
        console.error("토큰 디코딩 실패:", e);
        return null;
    }
};