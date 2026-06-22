import { Capacitor } from '@capacitor/core';

const NOTIF_ID = 1001;
const KEY = 'reminderTime'; // "HH:MM" or "" (off)

export const getReminderTime = (): string => localStorage.getItem(KEY) || '';

/** Schedule (or reschedule) a daily reminder at HH:MM. Returns false if blocked. */
export async function setDailyReminder(time: string): Promise<boolean> {
  localStorage.setItem(KEY, time);
  if (!Capacitor.isNativePlatform()) return false; // web can't schedule reliably; preference stored

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return false;

    await LocalNotifications.cancel({ notifications: [{ id: NOTIF_ID }] });
    const [hour, minute] = time.split(':').map(Number);
    await LocalNotifications.schedule({
      notifications: [{
        id: NOTIF_ID,
        title: 'Threads of Grace',
        body: 'A quiet moment is waiting for you. 🌿',
        schedule: { on: { hour, minute }, allowWhileIdle: true },
        smallIcon: 'ic_stat_icon',
      }],
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  localStorage.removeItem(KEY);
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: NOTIF_ID }] });
  } catch { /* noop */ }
}
