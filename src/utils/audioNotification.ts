// Notification Sound Player using the specified sound asset
export const NOTIFICATION_SOUND_URL = 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/notificaciones/universfield-new-notification-036-485897.mp3';

let notificationAudio: HTMLAudioElement | null = null;
let isAudioUnlocked = false;

// Preload the notification audio
function getAudioInstance(): HTMLAudioElement {
  if (!notificationAudio && typeof window !== 'undefined') {
    notificationAudio = new Audio(NOTIFICATION_SOUND_URL);
    notificationAudio.preload = 'auto';
    notificationAudio.volume = 1.0;
  }
  return notificationAudio!;
}

// Unlock audio on initial user interaction to comply with browser autoplay policies
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (isAudioUnlocked) return;
    try {
      const audio = getAudioInstance();
      // Brief play attempt muted to unlock iOS/Chrome AudioContext
      audio.muted = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
            isAudioUnlocked = true;
          })
          .catch(() => {
            // Will retry on next interaction
          });
      }
    } catch (e) {
      // Ignored
    }
  };

  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
}

/**
 * Plays the global system notification sound.
 * Guaranteed not to crash or throw errors even if blocked by autoplay.
 */
export async function playNotificationSound(): Promise<boolean> {
  try {
    const audio = getAudioInstance();
    audio.currentTime = 0;
    audio.volume = 1.0;
    audio.muted = false;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      await playPromise;
      return true;
    }
    return true;
  } catch (error) {
    console.warn('Audio playback prevented or failed:', error);
    // Fallback: Use subtle Web Audio API chime if MP3 couldn't play
    tryFallbackChime();
    return false;
  }
}

/**
 * Web Audio API fallback chime in case network drops or audio tag fails
 */
function tryFallbackChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Ignore fallback errors
  }
}
