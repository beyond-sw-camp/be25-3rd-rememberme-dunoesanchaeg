import { onMounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useSettingsStore } from '@/store/settings';

export function useThemeSettings() {
  const authStore = useAuthStore();
  const settingsStore = useSettingsStore();

  onMounted(() => {
    settingsStore.initSettings(authStore.fontSize, authStore.isHighContrast);
  });

  watch(
    () => [authStore.isHighContrast, authStore.fontSize],
    ([newContrast, newSize]) => {
      settingsStore.initSettings(newSize, newContrast);
    }
  );
}
