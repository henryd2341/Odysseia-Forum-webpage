import { useEffect, useMemo, useState } from "react";

import { useSettings, useThemeSettings } from "@/shared/hooks/useSettings";
import {
  isDarkThemeSetting,
  isLightThemeSetting,
  type DarkThemeSetting,
  type LightThemeSetting,
  type ThemeMode,
  type ThemeSetting,
  type UserSettings,
} from "@/shared/lib/settings";
import { withViewTransition } from "@/shared/lib/viewTransition";
import { themes, type Theme, type ThemeName } from "@/shared/styles/themes";

// 将用户设置的 themeSetting 字段映射到具体的 ThemeName
function mapThemeSettingToKey(themeSetting: ThemeSetting): ThemeName {
  switch (themeSetting) {
    case "discord-dark":
      return "discordDark";
    case "discord-light":
      return "discordLight";
    case "claude-dark":
      return "claudeDark";
    case "tokyo-night":
      return "tokyoNight";
    case "catppuccin":
      return "catppuccin";
    case "nord":
      return "nord";
    case "everforest":
      return "everforest";
    case "sakura-day":
      return "sakuraDay";
    case "yozakura-night":
      return "yozakuraNight";
  }
}

export function resolveThemeMode(
  settings: Pick<UserSettings, "followSystemTheme" | "themeMode">,
  systemPrefersDark: boolean,
): ThemeMode {
  if (!settings.followSystemTheme) {
    return settings.themeMode;
  }

  return systemPrefersDark ? "dark" : "light";
}

function getThemeSettingForMode(
  settings: Pick<UserSettings, "lightTheme" | "darkTheme">,
  mode: ThemeMode,
): ThemeSetting {
  return mode === "light" ? settings.lightTheme : settings.darkTheme;
}

export function useTheme() {
  const settings = useThemeSettings();
  const { updateSettings } = useSettings();

  // 监听系统深色模式偏好
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const { lightTheme, darkTheme, themeMode, followSystemTheme } = settings;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    // 初始化
    setSystemPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // 计算当前实际使用的主题：考虑themeMode & 系统偏好
  const currentMode = useMemo<ThemeMode>(
    () => resolveThemeMode({ followSystemTheme, themeMode }, systemPrefersDark),
    [followSystemTheme, themeMode, systemPrefersDark],
  );

  const currentThemeSetting = useMemo<ThemeSetting>(
    () => getThemeSettingForMode({ lightTheme, darkTheme }, currentMode),
    [lightTheme, darkTheme, currentMode],
  );

  const currentThemeName = useMemo<ThemeName>(
    () => mapThemeSettingToKey(currentThemeSetting),
    [currentThemeSetting],
  );

  const theme: Theme = themes[currentThemeName];

  const applyTransitionSettings = (
    updates: Partial<UserSettings>,
    animType: "circle" | "wipe-right" | "wipe-down",
    e?: React.MouseEvent,
  ) => {
    withViewTransition(() => updateSettings(updates), animType, e);
  };

  // 切换主题：只在深色/浅色之间切换，不轮播整套主题列表
  const toggleTheme = (e?: React.MouseEvent) => {
    const nextMode: ThemeMode = currentMode === "light" ? "dark" : "light";

    // 快捷切换模式使用向上或向右下擦除，这里为了配合效果随机选擦除
    const wipeAnim = Math.random() > 0.5 ? "wipe-right" : "wipe-down";

    applyTransitionSettings(
      {
        followSystemTheme: false,
        themeMode: nextMode,
      },
      wipeAnim,
      e,
    );
  };

  // “跟随系统主题”开启时，自动关闭并设置指定主题
  const setFollowSystemThemeWithTransition = (
    enabled: boolean,
    e?: React.MouseEvent,
  ) => {
    applyTransitionSettings(
      enabled
        ? { followSystemTheme: true }
        : {
            followSystemTheme: false,
            themeMode: currentMode,
          },
      "circle", // 设置页点击色块统一使用 circle 波纹
      e,
    );
  };

  // 设置指定主题
  function setThemeForModeWithTransition(
    mode: "light",
    themeSetting: LightThemeSetting,
    e?: React.MouseEvent,
  ): void;
  function setThemeForModeWithTransition(
    mode: "dark",
    themeSetting: DarkThemeSetting,
    e?: React.MouseEvent,
  ): void;
  function setThemeForModeWithTransition(
    mode: ThemeMode,
    themeSetting: ThemeSetting,
    e?: React.MouseEvent,
  ) {
    if (mode === "light") {
      if (!isLightThemeSetting(themeSetting)) return;

      applyTransitionSettings(
        {
          followSystemTheme: false,
          themeMode: mode,
          lightTheme: themeSetting,
        },
        "circle",
        e,
      );
      return;
    }

    if (!isDarkThemeSetting(themeSetting)) return;

    applyTransitionSettings(
      {
        followSystemTheme: false,
        themeMode: mode,
        darkTheme: themeSetting,
      },
      "circle",
      e,
    );
  }

  return {
    theme,
    currentTheme: currentThemeName,
    currentMode,
    currentThemeSetting,
    isDarkTheme: currentMode === "dark",
    toggleTheme,
    setThemeForModeWithTransition,
    setFollowSystemThemeWithTransition,
  };
}
