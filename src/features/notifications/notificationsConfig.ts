import { APP_VERSION, RELEASE_FEED_URL } from '@/shared/config/appInfo';
import type { Thread } from '@/entities/thread/types';
import { parse as parseYaml } from 'yaml';
import serverIconUrl from '@/assets/images/icon/A90C044F8DDF1959B2E9078CB629C239.png';

// ── 通知类型 ──────────────────────────────────────────
export type NotificationKind = 'release' | 'announcement' | 'maintenance';

export interface StaticNotificationDefinition {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  created_at: string;
  starts_at: string;
  expires_at: string | null;
  version?: string;
  url?: string;
  previewThread?: Thread;
}

export interface ResolvedNotificationContext {
  currentAppVersion?: string;
}

// ── YAML Feed 原始类型 ──────────────────────────────────
interface ReleaseFeedItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  kind?: NotificationKind;
  /** @deprecated 兼容旧格式，映射到 kind */
  source?: 'webpage' | 'system';
  version?: string;
  url?: string;
  min_app_version?: string;
  starts_at?: string;
  expires_at?: string;
  preview_thread?: {
    thread_id?: string;
    guild_id?: string;
    channel_id?: string;
    title?: string;
    created_at?: string;
    last_active_at?: string | null;
    first_message_excerpt?: string;
    thumbnail_urls?: string[];
    tags?: string[];
    virtual_tags?: string[];
    author?: {
      id?: string;
      name?: string;
      global_name?: string | null;
      display_name?: string;
      avatar_url?: string | null;
    };
  };
}

interface ReleaseFeedPayload {
  updates: ReleaseFeedItem[];
}

// ── 工具函数 ──────────────────────────────────────────

function compareSemver(a: string, b: string): number {
  const toNums = (v: string) =>
    v
      .split('.')
      .map((part) => Number.parseInt(part, 10))
      .map((n) => (Number.isFinite(n) ? n : 0));
  const av = toNums(a);
  const bv = toNums(b);
  const max = Math.max(av.length, bv.length);
  for (let i = 0; i < max; i += 1) {
    const ai = av[i] ?? 0;
    const bi = bv[i] ?? 0;
    if (ai > bi) return 1;
    if (ai < bi) return -1;
  }
  return 0;
}

/** 将旧 `source` 字段映射到新 `kind` 体系 */
function resolveKind(item: ReleaseFeedItem): NotificationKind {
  if (item.kind) return item.kind;
  // 兼容旧格式
  if (item.source === 'system') return 'maintenance';
  if (item.version) return 'release';
  return 'announcement';
}

// ── 数据转换 ──────────────────────────────────────────

function toPreviewThread(item: ReleaseFeedItem): Thread {
  const preview = item.preview_thread;
  const createdAt = preview?.created_at ?? item.created_at;
  const author = preview?.author
    ? {
        id: preview.author.id ?? `notification-author-${item.id}`,
        name: preview.author.name ?? preview.author.display_name ?? 'Odysseia',
        global_name: preview.author.global_name ?? null,
        display_name: preview.author.display_name ?? preview.author.name ?? 'Odysseia',
        // 默认头像：服务器 icon
        avatar_url: preview.author.avatar_url ?? serverIconUrl,
      }
    : {
        id: `notification-author-${item.id}`,
        name: 'Odysseia',
        global_name: null,
        display_name: 'Odysseia',
        avatar_url: serverIconUrl,
      };

  return {
    thread_id: preview?.thread_id ?? `notification-${item.id}`,
    guild_id: preview?.guild_id,
    channel_id: preview?.channel_id ?? 'notification',
    title: preview?.title ?? item.title,
    author,
    created_at: createdAt,
    last_active_at: preview?.last_active_at ?? createdAt,
    reaction_count: 0,
    reply_count: 0,
    display_count: 0,
    first_message_excerpt: preview?.first_message_excerpt ?? item.message,
    tags: preview?.tags ?? [],
    virtual_tags: preview?.virtual_tags ?? [],
    thumbnail_urls: preview?.thumbnail_urls ?? [],
    collected_flag: false,
    has_update: false,
  };
}

function mapFeedItem(item: ReleaseFeedItem): StaticNotificationDefinition {
  const kind = resolveKind(item);
  return {
    id: item.id,
    kind,
    title: item.title,
    message: item.message,
    created_at: item.created_at,
    starts_at: item.starts_at ?? item.created_at,
    expires_at: item.expires_at ?? null,
    version: item.version,
    url: item.url,
    previewThread: toPreviewThread(item),
  };
}

// ── 过滤逻辑 ──────────────────────────────────────────

function isWithinTimeWindow(item: ReleaseFeedItem): boolean {
  const now = Date.now();
  const startsAt = item.starts_at ?? item.created_at;
  if (new Date(startsAt).getTime() > now) return false;
  if (item.expires_at && new Date(item.expires_at).getTime() < now) return false;
  return true;
}

function passesVersionGate(item: ReleaseFeedItem, currentVersion: string): boolean {
  if (!item.min_app_version) return true;
  return compareSemver(currentVersion, item.min_app_version) >= 0;
}

// ── 公开 API ──────────────────────────────────────────

export async function fetchReleaseNotifications(
  context?: ResolvedNotificationContext,
): Promise<StaticNotificationDefinition[]> {
  const currentVersion = context?.currentAppVersion ?? APP_VERSION;
  try {
    const response = await fetch(RELEASE_FEED_URL, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/yaml, text/yaml, application/json, text/plain',
      },
    });
    if (!response.ok) {
      return [];
    }

    const raw = await response.text();
    const payload = parseYaml(raw) as ReleaseFeedPayload;
    const updates = Array.isArray(payload.updates) ? payload.updates : [];

    return updates
      .filter((item): item is ReleaseFeedItem => {
        if (!item || typeof item !== 'object') return false;
        return (
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.message === 'string' &&
          typeof item.created_at === 'string'
        );
      })
      .filter((item) => isWithinTimeWindow(item))
      .filter((item) => passesVersionGate(item, currentVersion))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(mapFeedItem);
  } catch {
    return [];
  }
}

/**
 * 根据上下文过滤静态通知。
 *
 * 当前实现比较简单：直接返回全部静态通知。
 * 未来可以根据用户偏好 / 是否首次访问等做更精细的控制。
 */
export async function resolveStaticNotifications(
  context?: ResolvedNotificationContext,
): Promise<StaticNotificationDefinition[]> {
  return fetchReleaseNotifications(context);
}
