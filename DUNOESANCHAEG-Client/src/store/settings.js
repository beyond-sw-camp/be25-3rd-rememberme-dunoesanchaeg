import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // 'small', 'medium', 'large' 등 가능
  const fontSizeMode = ref('medium');

  /**
   * 멤버 설정(API)이나 UI 이벤트 발생 시 이 함수를 호출하여 
   * 최상단 html 속성을 변경, 전역 CSS 스케일을 조절합니다.
   * @param {'small' | 'medium' | 'large'} mode 
   */
  const setFontSize = (mode) => {
    fontSizeMode.value = mode;
    
    // 루트 HTML 요소의 data 속성을 통해 main.css에 정의된 변수가 적용되게 함
    if (mode === 'medium') {
      document.documentElement.removeAttribute('data-font-size');
    } else {
      document.documentElement.setAttribute('data-font-size', mode);
    }
  };

  /**
   * 혹시 로컬스토리지나 서버에서 가져온 초기값을 적용하고 싶을 때 실행하는 초기화 함수
   */
  const initSettings = (initialMode = 'medium') => {
    setFontSize(initialMode);
  };

  return {
    fontSizeMode,
    setFontSize,
    initSettings
  };
});
