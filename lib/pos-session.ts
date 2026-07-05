import type { PosSession } from '@/lib/types';

const STORAGE_KEY = 'kassesync_pos_session';

export function loadPosSession(): PosSession {
  if (typeof window === 'undefined') {
    return { tableNumber: '1', waiterName: '' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PosSession;
  } catch {
    // ignore
  }
  return { tableNumber: '1', waiterName: '' };
}

export function savePosSession(session: PosSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
