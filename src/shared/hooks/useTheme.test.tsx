import { beforeEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook, waitFor } from '@/tests/test-utils';
import { useSettingsStore } from '@/shared/store/settingsStore';

import { useTheme } from './useTheme';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
    useSettingsStore.getState().resetSettingsState({
      fontSize: 'medium',
      fontMode: 'system',
      cardSize: 'normal',
      layoutMode: 'grid',
      compactMode: false,
      imageMode: 'normal',
      lightTheme: 'discord-light',
      darkTheme: 'claude-dark',
      themeMode: 'dark',
      followSystemTheme: false,
      glassMode: 'off',
      glassBlur: 16,
      backgroundlessMode: false,
      backgroundImageEnabled: false,
      backgroundImageUrl: '',
      backgroundImageBase64: '',
      backgroundImageOpacity: 0.68,
      sidebarCollapsed: false,
      notifications: {
        newPosts: true,
        replies: true,
        mentions: true,
      },
      openMode: 'app',
    });
  });

  it('toggles between theme slots without overwriting either configured theme', async () => {
    useSettingsStore.getState().resetSettingsState({
      ...useSettingsStore.getState().settings,
      lightTheme: 'sakura-day',
      darkTheme: 'nord',
      themeMode: 'light',
      followSystemTheme: false,
    });

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.currentTheme).toBe('sakuraDay');
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(useSettingsStore.getState().settings.lightTheme).toBe('sakura-day');
    expect(useSettingsStore.getState().settings.darkTheme).toBe('nord');
    expect(useSettingsStore.getState().settings.themeMode).toBe('dark');
    expect(useSettingsStore.getState().settings.followSystemTheme).toBe(false);

    await waitFor(() => {
      expect(result.current.currentTheme).toBe('nord');
    });
  });

  it('turns off follow-system mode before toggling manually from the sidebar', async () => {
    useSettingsStore.getState().resetSettingsState({
      ...useSettingsStore.getState().settings,
      lightTheme: 'discord-light',
      darkTheme: 'yozakura-night',
      themeMode: 'light',
      followSystemTheme: true,
    });

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.currentTheme).toBe('discordLight');
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(useSettingsStore.getState().settings.followSystemTheme).toBe(false);
    expect(useSettingsStore.getState().settings.themeMode).toBe('dark');
    expect(useSettingsStore.getState().settings.darkTheme).toBe('yozakura-night');

    await waitFor(() => {
      expect(result.current.currentTheme).toBe('yozakuraNight');
    });
  });

  it('updates only the selected slot when applying a theme from settings', async () => {
    useSettingsStore.getState().resetSettingsState({
      ...useSettingsStore.getState().settings,
      lightTheme: 'discord-light',
      darkTheme: 'claude-dark',
      themeMode: 'dark',
      followSystemTheme: true,
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setThemeForModeWithTransition('light', 'sakura-day');
    });

    expect(useSettingsStore.getState().settings.lightTheme).toBe('sakura-day');
    expect(useSettingsStore.getState().settings.darkTheme).toBe('claude-dark');
    expect(useSettingsStore.getState().settings.themeMode).toBe('light');
    expect(useSettingsStore.getState().settings.followSystemTheme).toBe(false);

    await waitFor(() => {
      expect(result.current.currentTheme).toBe('sakuraDay');
    });
  });
});
