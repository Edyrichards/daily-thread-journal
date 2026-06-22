import { Capacitor } from '@capacitor/core';

/**
 * Native shell setup — only runs inside the Capacitor (Android/iOS) app.
 * On the web it's a no-op, so the same build works everywhere.
 */
export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const [{ SplashScreen }, { StatusBar, Style }, { App }] = await Promise.all([
    import('@capacitor/splash-screen'),
    import('@capacitor/status-bar'),
    import('@capacitor/app'),
  ]);

  const applyStatusBar = async () => {
    const dark = document.documentElement.classList.contains('dark');
    try {
      await StatusBar.setStyle({ style: dark ? Style.Light : Style.Dark });
      await StatusBar.setBackgroundColor({ color: dark ? '#1A1F1C' : '#F5F0E8' });
    } catch { /* status bar not available */ }
  };
  await applyStatusBar();
  // keep the bar in sync when the theme class changes
  new MutationObserver(applyStatusBar).observe(document.documentElement, {
    attributes: true, attributeFilter: ['class'],
  });

  // Android hardware back: go back in history, or exit from the home screen.
  App.addListener('backButton', () => {
    if (window.location.pathname !== '/' && window.history.length > 1) window.history.back();
    else App.exitApp();
  });

  setTimeout(() => SplashScreen.hide().catch(() => {}), 250);
}
