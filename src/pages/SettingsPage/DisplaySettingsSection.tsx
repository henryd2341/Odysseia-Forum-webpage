import {
  Grid,
  Image as ImageIcon,
  ImageOff,
  Layout,
  List,
  Maximize2,
  Minimize2,
  Monitor,
  Scan,
  Type,
<<<<<<< Updated upstream
=======
  ExternalLink,
  AppWindow,
  Moon,
  Sun,
>>>>>>> Stashed changes
} from 'lucide-react';

import { themes } from '@/shared/styles/themes';
import type { UserSettings } from '@/shared/lib/settings';
import { useTheme } from '@/shared/hooks/useTheme';

import { darkThemeOptions, lightThemeOptions } from './config';
import { SettingsToggle } from './SettingsToggle';
import { SettingsPageSection } from './SettingsPageSection';

type DisplaySettingsSectionProps = {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
};

export function DisplaySettingsSection({ settings, updateSettings }: DisplaySettingsSectionProps) {
  const {
    currentMode,
    setFollowSystemThemeWithTransition,
    setThemeForModeWithTransition,
  } = useTheme();
  const inlineChoiceClass = 'od-option-inline';
  const rowChoiceClass = 'od-setting-choice flex items-center gap-3 p-4 text-left';
  const themeBadgeClass =
    'rounded-full border border-(--od-shell-line) px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]';

  return (
    <SettingsPageSection dividerLabel="Display" kicker="Visual Hierarchy" title="显示设置" icon={Layout}>
      <div className="space-y-7">
        <div data-tour="layout-image-settings">
          <label className="mb-1 block text-[1.1rem] font-semibold tracking-[-0.02em] text-(--od-text-primary)">
            阅读尺寸
          </label>
          <p className="mb-3 text-[0.82rem] leading-[1.55] text-(--od-text-secondary)">
            把字体和卡片密度放在一起调，会更容易找到舒服的阅读节奏。
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-(--od-text-label)">Font Size</p>
              <div className="od-options-wrap">
                {(['small', 'medium', 'large'] as const).map((size) => {
                  const isActive = settings.fontSize === size;
                  const sampleSizeClass =
                    size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-lg';

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateSettings({ fontSize: size })}
                      data-active={isActive}
                      className={`${inlineChoiceClass} min-w-20 justify-center`}
                    >
                      <span
                        className={`od-choice-value font-semibold leading-none ${sampleSizeClass} ${
                          isActive ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'
                        }`}
                      >
                        Aa
                      </span>
                      <span
                        className={`od-choice-title text-sm ${
                          isActive ? 'font-medium text-(--od-text-primary)' : 'text-(--od-text-primary)'
                        }`}
                      >
                        {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-(--od-text-label)">Card Density</p>
              <div className="od-options-wrap">
                {(['compact', 'normal', 'large'] as const).map((size) => {
                  const isActive = settings.cardSize === size;
                  const Icon = size === 'compact' ? Minimize2 : size === 'normal' ? Scan : Maximize2;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateSettings({ cardSize: size })}
                      data-active={isActive}
                      className={`${inlineChoiceClass} min-w-24 justify-center`}
                    >
                      <Icon
                        className={`od-choice-icon h-5 w-5 ${
                          isActive ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'
                        }`}
                      />
                      <span
                        className={`od-choice-title text-sm ${
                          isActive ? 'font-medium text-(--od-text-primary)' : 'text-(--od-text-primary)'
                        }`}
                      >
                        {size === 'compact' ? '紧凑' : size === 'normal' ? '标准' : '宽松'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[1.1rem] font-semibold tracking-[-0.02em] text-(--od-text-primary)">
            字体来源
          </label>
          <p className="mb-3 text-[0.82rem] leading-[1.55] text-(--od-text-secondary)">
            有些主题自带好看的字体，开启后我会帮你自动加载；关掉就回到系统默认字体。
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => updateSettings({ fontMode: 'system' })}
              data-active={settings.fontMode === 'system'}
              className={`${rowChoiceClass} ${settings.fontMode === 'system' ? '' : ''}`}
            >
              <Monitor className={`od-choice-icon h-5 w-5 ${settings.fontMode === 'system' ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'}`} />
              <div className="text-left">
                <div className="od-choice-title text-sm font-medium text-(--od-text-primary)">系统字体</div>
                <div className="text-xs text-(--od-text-tertiary)">最快、最稳，保持设备默认阅读习惯</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ fontMode: 'theme' })}
              data-active={settings.fontMode === 'theme'}
              className={`${rowChoiceClass} ${settings.fontMode === 'theme' ? '' : ''}`}
            >
              <Type className={`od-choice-icon h-5 w-5 ${settings.fontMode === 'theme' ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'}`} />
              <div className="text-left">
                <div className="od-choice-title text-sm font-medium text-(--od-text-primary)">主题字体</div>
                <div className="text-xs text-(--od-text-tertiary)">自动加载主题附带字体，让主题不仅换色也换字形</div>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[1.1rem] font-semibold tracking-[-0.02em] text-(--od-text-primary)">
            布局与图片
          </label>
          <p className="mb-3 text-[0.82rem] leading-[1.55] text-(--od-text-secondary)">
            网格更偏视觉浏览，列表更偏高效筛选；图片则决定内容流是更有氛围还是更专注文案。
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => updateSettings({ layoutMode: 'grid' })}
                data-active={settings.layoutMode === 'grid'}
                className={`${rowChoiceClass} ${settings.layoutMode === 'grid' ? '' : ''}`}
              >
                <Grid className={`od-choice-icon h-5 w-5 ${settings.layoutMode === 'grid' ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'}`} />
                <div className="text-left">
                  <div className="od-choice-title text-sm font-medium text-(--od-text-primary)">网格布局</div>
                  <div className="text-xs text-(--od-text-tertiary)">适合广场、封面、视觉浏览</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ layoutMode: 'list' })}
                data-active={settings.layoutMode === 'list'}
                className={`${rowChoiceClass} ${settings.layoutMode === 'list' ? '' : ''}`}
              >
                <List className={`od-choice-icon h-5 w-5 ${settings.layoutMode === 'list' ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'}`} />
                <div className="text-left">
                  <div className="od-choice-title text-sm font-medium text-(--od-text-primary)">列表布局</div>
                  <div className="text-xs text-(--od-text-tertiary)">适合搜索、筛选和连续阅读</div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => updateSettings({ imageMode: 'normal' })}
                data-active={settings.imageMode === 'normal'}
                className={`${rowChoiceClass} ${settings.imageMode === 'normal' ? '' : ''}`}
              >
                <ImageIcon className={`od-choice-icon h-5 w-5 ${settings.imageMode === 'normal' ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'}`} />
                <div className="text-left">
                  <div className="od-choice-title text-sm font-medium text-(--od-text-primary)">正常加载</div>
                  <div className="text-xs text-(--od-text-tertiary)">显示缩略图，更完整也更有情绪氛围</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ imageMode: 'off' })}
                data-active={settings.imageMode === 'off'}
                className={`${rowChoiceClass} ${settings.imageMode === 'off' ? '' : ''}`}
              >
                <ImageOff className={`od-choice-icon h-5 w-5 ${settings.imageMode === 'off' ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'}`} />
                <div className="text-left">
                  <div className="od-choice-title text-sm font-medium text-(--od-text-primary)">关闭图片</div>
                  <div className="text-xs text-(--od-text-tertiary)">更纯粹，也更省流</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[1.1rem] font-semibold tracking-[-0.02em] text-(--od-text-primary)">
            主题氛围
          </label>
          <p className="mb-3 text-[0.82rem] leading-[1.55] text-(--od-text-secondary)">
            每套主题都是成组的色彩与字形方案，不只是单纯换个底色。
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-(--od-shell-line) bg-[color-mix(in_srgb,var(--od-surface-input)_76%,transparent)] p-4">
              <div className="min-w-0">
                <div className="text-sm font-medium text-(--od-text-primary)">跟随系统</div>
                <div className="text-xs leading-[1.55] text-(--od-text-tertiary)">
                  打开后按系统深浅色在日间与夜间槽位之间切换，不会覆盖你分别选好的主题。
                </div>
              </div>
              <SettingsToggle
                checked={settings.followSystemTheme}
                onToggle={(e) => setFollowSystemThemeWithTransition(!settings.followSystemTheme, e)}
                ariaLabel="切换是否跟随系统主题"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-[1.3rem] border border-(--od-shell-line) bg-[color-mix(in_srgb,var(--od-surface-input)_72%,transparent)] p-3">
                <div className="mb-3 flex items-start justify-between gap-3 px-1">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-[color-mix(in_srgb,var(--od-accent)_12%,transparent)] p-2 text-(--od-accent)">
                      <Sun className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-(--od-text-primary)">日间主题</div>
                      <div className="text-xs leading-[1.55] text-(--od-text-tertiary)">
                        亮底阅读、通透浏览，适合白天或高环境亮度场景。
                      </div>
                    </div>
                  </div>
                  <span
                    className={`${themeBadgeClass} ${
                      currentMode === 'light'
                        ? 'border-(--od-accent) text-(--od-accent)'
                        : 'text-(--od-text-tertiary)'
                    }`}
                  >
                    {currentMode === 'light'
                      ? settings.followSystemTheme
                        ? '系统当前使用'
                        : '当前生效'
                      : settings.followSystemTheme
                        ? '系统待切换'
                        : '手动待机'}
                  </span>
                </div>

                <div className="space-y-2">
                  {lightThemeOptions.map((option) => {
                    const isSelected = settings.lightTheme === option.id;
                    const themeColors = themes[option.themeKey].colors;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={(e) => {
                          setThemeForModeWithTransition('light', option.id, e);
                        }}
                        data-active={isSelected}
                        className={`${rowChoiceClass} w-full justify-between`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <option.icon
                            className={`od-choice-icon h-5 w-5 ${
                              isSelected ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'
                            }`}
                          />
                          <div className="flex min-w-0 flex-col text-left">
                            <span className="od-choice-title text-xs text-(--od-text-primary)">
                              {option.label}
                            </span>
                            <span className="truncate text-[10px] text-(--od-text-tertiary)">
                              {option.description}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex shrink-0 gap-1.5">
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ background: themeColors.background }}
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ background: themeColors.card }}
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ background: themeColors.accent }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-(--od-shell-line) bg-[color-mix(in_srgb,var(--od-surface-input)_72%,transparent)] p-3">
                <div className="mb-3 flex items-start justify-between gap-3 px-1">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-[color-mix(in_srgb,var(--od-accent)_12%,transparent)] p-2 text-(--od-accent)">
                      <Moon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-(--od-text-primary)">夜间主题</div>
                      <div className="text-xs leading-[1.55] text-(--od-text-tertiary)">
                        深底沉浸、信息收束，适合夜间浏览和低光环境。
                      </div>
                    </div>
                  </div>
                  <span
                    className={`${themeBadgeClass} ${
                      currentMode === 'dark'
                        ? 'border-(--od-accent) text-(--od-accent)'
                        : 'text-(--od-text-tertiary)'
                    }`}
                  >
                    {currentMode === 'dark'
                      ? settings.followSystemTheme
                        ? '系统当前使用'
                        : '当前生效'
                      : settings.followSystemTheme
                        ? '系统待切换'
                        : '手动待机'}
                  </span>
                </div>

                <div className="space-y-2">
                  {darkThemeOptions.map((option) => {
                    const isSelected = settings.darkTheme === option.id;
                    const themeColors = themes[option.themeKey].colors;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={(e) => {
                          setThemeForModeWithTransition('dark', option.id, e);
                        }}
                        data-active={isSelected}
                        className={`${rowChoiceClass} w-full justify-between`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <option.icon
                            className={`od-choice-icon h-5 w-5 ${
                              isSelected ? 'text-(--od-accent)' : 'text-(--od-text-secondary)'
                            }`}
                          />
                          <div className="flex min-w-0 flex-col text-left">
                            <span className="od-choice-title text-xs text-(--od-text-primary)">
                              {option.label}
                            </span>
                            <span className="truncate text-[10px] text-(--od-text-tertiary)">
                              {option.description}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex shrink-0 gap-1.5">
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ background: themeColors.background }}
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ background: themeColors.card }}
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ background: themeColors.accent }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsPageSection>
  );
}
