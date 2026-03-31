/**
 * JWT 토큰에서 유저의 Role(권한) 정보를 추출하는 유틸리티
 * @param {string | null} token - 브라우저에 저장된 JWT 토큰
 * @returns {string | null} 추출된 권한명 (USER, WITHDRAWN 등)
 */
export const getRoleFromToken = (token) => {
    // 1. 토큰이 없으면 즉시 null 반환
    if (!token) return null;

    try {
        // 2. JWT의 두 번째 부분(Payload)을 추출합니다.
        const base64Payload = token.split('.')[1];

        // 3. Base64로 인코딩된 문자열을 디코딩(atob)하고 JSON으로 파싱합니다.
        //
        const payload = JSON.parse(atob(base64Payload));

        // 4. 페이로드 안에 담긴 role 값을 반환합니다.
        return payload.role || null;
    } catch (e) {
        console.error("토큰 디코딩 실패:", e);
        return null;
    }
};