import { flushSync } from 'react-dom';

export type ViewTransitionAnim = 'circle' | 'wipe-right' | 'wipe-down';

/**
 * 通用 View Transition 触发器。
 *
 * 1. 在 <html> 上标记 `data-theme-transition` 以激活对应 CSS 动画
 * 2. 调用 `document.startViewTransition` 捕获快照
 * 3. 动画播完后自动清理属性
 *
 * 如果浏览器不支持 View Transitions API，则直接执行回调。
 */
export function withViewTransition(
  callback: () => void,
  anim: ViewTransitionAnim,
  e?: React.MouseEvent | { clientX: number; clientY: number },
) {
  if (!document.startViewTransition) {
    callback();
    return;
  }

  const root = document.documentElement;
  root.setAttribute('data-theme-transition', anim);

  if (e && anim === 'circle') {
    root.style.setProperty('--click-x', `${e.clientX}px`);
    root.style.setProperty('--click-y', `${e.clientY}px`);
  }

  const transition = document.startViewTransition(() => {
    flushSync(callback);
  });

  transition.finished.then(() => {
    root.removeAttribute('data-theme-transition');
  });
}
