import { beforeEach, describe, expect, it } from 'vitest';

import { getUserSettings } from './settings';

const SETTINGS_KEY = 'odysseia_user_settings';

describe('settings theme migration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('migrates a legacy dark theme into the dark slot and keeps a default light slot', () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        theme: 'yozakura-night',
      }),
    );

    const settings = getUserSettings();

    expect(settings.darkTheme).toBe('yozakura-night');
    expect(settings.lightTheme).toBe('discord-light');
    expect(settings.themeMode).toBe('dark');
    expect(settings.followSystemTheme).toBe(false);
  });

  it('migrates a legacy light theme into the light slot and keeps a default dark slot', () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        theme: 'sakura-day',
      }),
    );

    const settings = getUserSettings();

    expect(settings.lightTheme).toBe('sakura-day');
    expect(settings.darkTheme).toBe('claude-dark');
    expect(settings.themeMode).toBe('light');
    expect(settings.followSystemTheme).toBe(false);
  });

  it('migrates legacy auto into follow-system mode without losing the new slots', () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        theme: 'auto',
      }),
    );

    const settings = getUserSettings();

    expect(settings.lightTheme).toBe('discord-light');
    expect(settings.darkTheme).toBe('claude-dark');
    expect(settings.followSystemTheme).toBe(true);
  });
});
