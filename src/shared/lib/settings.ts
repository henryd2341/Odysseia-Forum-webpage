// 设置相关的类型定义和存储管理

// 主题选择：按日间/夜间划分的多套主题
export const lightThemeSettings = ["discord-light", "sakura-day"] as const;
export const darkThemeSettings = [
  "discord-dark",
  "claude-dark",
  "tokyo-night",
  "catppuccin",
  "nord",
  "everforest",
  "yozakura-night",
] as const;

export type LightThemeSetting = (typeof lightThemeSettings)[number];
export type DarkThemeSetting = (typeof darkThemeSettings)[number];
export type ThemeSetting = LightThemeSetting | DarkThemeSetting;
export type ThemeMode = "light" | "dark";

// 默认的主题
export const defaultLightTheme: LightThemeSetting = "discord-light";
export const defaultDarkTheme: DarkThemeSetting = "claude-dark";
export const defaultThemeMode: ThemeMode = "dark";

// 常驻系统主题偏好：日间、夜间、自动
export function isLightThemeSetting(
  value: unknown,
): value is LightThemeSetting {
  return (
    typeof value === "string" &&
    lightThemeSettings.includes(value as LightThemeSetting)
  );
}

export function isDarkThemeSetting(value: unknown): value is DarkThemeSetting {
  return (
    typeof value === "string" &&
    darkThemeSettings.includes(value as DarkThemeSetting)
  );
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

export interface UserSettings {
  fontSize: "small" | "medium" | "large";
  fontMode: "system" | "theme";
  cardSize: "compact" | "normal" | "large";
  layoutMode: "grid" | "list";
  compactMode: boolean;
  /**
   * 图片加载策略：
   * - normal：正常加载所有图片
   * - off：尽量不加载非必要图片（帖子缩略图等）
   */
  imageMode: "normal" | "off";
  lightTheme: LightThemeSetting;
  darkTheme: DarkThemeSetting;
  themeMode: ThemeMode;
  followSystemTheme: boolean;
  glassMode: "off" | "on" | "auto";
  glassBlur: number;
  backgroundlessMode: boolean;
  backgroundImageEnabled: boolean;
  backgroundImageUrl: string;
  backgroundImageBase64: string;
  backgroundImageOpacity: number;
  sidebarCollapsed: boolean;
  notifications: {
    newPosts: boolean;
    replies: boolean;
    mentions: boolean;
  };
  openMode: "app" | "web";
}

const SETTINGS_KEY = "odysseia_user_settings";

// 默认设置
const defaultSettings: UserSettings = {
  fontSize: "medium",
  fontMode: "system",
  cardSize: "normal",
  layoutMode: "grid",
  compactMode: false,
  imageMode: "normal",
  lightTheme: defaultLightTheme,
  darkTheme: defaultDarkTheme,
  themeMode: defaultThemeMode,
  followSystemTheme: false,
  glassMode: "off",
  glassBlur: 16,
  backgroundlessMode: false,
  backgroundImageEnabled: false,
  backgroundImageUrl: "",
  backgroundImageBase64: "",
  backgroundImageOpacity: 0.68,
  sidebarCollapsed: false,
  notifications: {
    newPosts: true,
    replies: true,
    mentions: true,
  },
  openMode: "app",
};

// 兼容旧的 theme 值
function normalizeStoredTheme(
  rawTheme: string | undefined,
): ThemeSetting | "auto" | undefined {
  switch (rawTheme) {
    case "dark":
      return "discord-dark";
    case "light":
      return "discord-light";
    case "paper-dark":
    case "paper-light":
      return "claude-dark";
    case "tweak-gray-dark":
    case "tweak-gray-light":
      return "nord";
    case "auto":
      return "auto";
    default:
      if (isLightThemeSetting(rawTheme) || isDarkThemeSetting(rawTheme)) {
        return rawTheme;
      }
      return undefined;
  }
}

// 将现有 theme 值迁移到当前的主题方案
function migrateThemeSettings(
  parsed: Partial<UserSettings> & { theme?: string },
): Pick<
  UserSettings,
  "lightTheme" | "darkTheme" | "themeMode" | "followSystemTheme"
> {
  const legacyTheme = normalizeStoredTheme(parsed.theme);
  const inferredMode =
    legacyTheme && legacyTheme !== "auto"
      ? isLightThemeSetting(legacyTheme)
        ? "light"
        : "dark"
      : defaultThemeMode;

  return {
    lightTheme: isLightThemeSetting(parsed.lightTheme)
      ? parsed.lightTheme
      : legacyTheme && isLightThemeSetting(legacyTheme)
        ? legacyTheme
        : defaultLightTheme,
    darkTheme: isDarkThemeSetting(parsed.darkTheme)
      ? parsed.darkTheme
      : legacyTheme && isDarkThemeSetting(legacyTheme)
        ? legacyTheme
        : defaultDarkTheme,
    themeMode: isThemeMode(parsed.themeMode) ? parsed.themeMode : inferredMode,
    followSystemTheme:
      typeof parsed.followSystemTheme === "boolean"
        ? parsed.followSystemTheme
        : legacyTheme === "auto",
  };
}

// 获取用户设置
export function getUserSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<UserSettings> & {
        theme?: string;
      };
      const migratedThemeSettings = migrateThemeSettings(parsed);

      if (typeof parsed.backgroundImageOpacity === "number") {
        parsed.backgroundImageOpacity = Math.max(
          0,
          Math.min(1, parsed.backgroundImageOpacity),
        );
      }

      if (typeof parsed.glassBlur === "number") {
        parsed.glassBlur = Math.max(0, Math.min(32, parsed.glassBlur));
      }

      const { theme: _legacyTheme, ...rest } = parsed;

      // 合并默认设置，确保新增的设置项有默认值
      return {
        ...defaultSettings,
        ...rest,
        ...migratedThemeSettings,
      };
    }
  } catch (error) {
    console.error("Failed to load user settings:", error);
  }
  return defaultSettings;
}

// 保存用户设置
export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save user settings:", error);
  }
}

// 更新部分设置
export function updateUserSettings(updates: Partial<UserSettings>): void {
  const current = getUserSettings();
  const updated = { ...current, ...updates };
  saveUserSettings(updated);
}

// 重置设置
export function resetUserSettings(): void {
  saveUserSettings(defaultSettings);
}

// 字体大小映射（拉大差异，让设置切换有明显体感）
export const fontSizeMap = {
  small: {
    // 更紧凑
    title: "text-sm", // 14px
    content: "text-xs", // 12px
    meta: "text-[10px]", // ~10px
  },
  medium: {
    // 默认
    title: "text-lg", // 18px
    content: "text-sm", // 14px
    meta: "text-xs", // 12px
  },
  large: {
    // 明显放大
    title: "text-2xl", // 24px
    content: "text-lg", // 18px
    meta: "text-base", // 16px
  },
};

// 卡片大小映射
export const cardSizeMap = {
  compact: {
    padding: "p-2",
    gap: "gap-2",
    imageHeight: "aspect-square md:aspect-4/5",
    titleLines: "line-clamp-1",
    contentLines: "line-clamp-2",
  },
  normal: {
    padding: "p-3",
    gap: "gap-3",
    imageHeight: "aspect-3/5 md:aspect-3/4",
    titleLines: "line-clamp-2",
    contentLines: "line-clamp-3",
  },
  large: {
    padding: "p-4",
    gap: "gap-4",
    imageHeight: "aspect-1/2 md:aspect-2/3",
    titleLines: "line-clamp-3",
    contentLines: "line-clamp-4",
  },
};
