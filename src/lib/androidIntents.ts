/**
 * Real Android URL Schemes & Intent Dispatcher for Android WebView Overlay
 * Uses window.location.href so Android's WebView / ActivityManager intercepts
 * and launches the real installed native applications on the user's device.
 */

export class AndroidIntents {
  /**
   * Fires a native URI or intent:// scheme directly via window.location.href
   */
  static triggerUri(uri: string): void {
    if (typeof window === 'undefined') return;
    window.location.href = uri;
  }

  /**
   * Opens Spotify or searches a song/artist/album/playlist in the native Spotify Android app
   */
  static openSpotify(searchQuery?: string): void {
    const clean = (searchQuery || '').trim();
    if (clean) {
      // spotify:search:<query> opens the native Spotify app directly on the search results screen
      this.triggerUri(`spotify:search:${encodeURIComponent(clean)}`);
    } else {
      this.triggerUri('spotify://');
    }
  }

  /**
   * Opens WhatsApp or starts a direct chat / message in the native WhatsApp Android app
   */
  static openWhatsApp(options?: { phone?: string; text?: string }): void {
    const cleanPhone = (options?.phone || '').replace(/[^\d]/g, '');
    const text = (options?.text || '').trim();

    if (cleanPhone && text) {
      this.triggerUri(`whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`);
    } else if (cleanPhone) {
      this.triggerUri(`whatsapp://send?phone=${cleanPhone}`);
    } else if (text) {
      this.triggerUri(`whatsapp://send?text=${encodeURIComponent(text)}`);
    } else {
      this.triggerUri('whatsapp://send');
    }
  }

  /**
   * Opens Telegram or shares a message in the native Telegram Android app
   */
  static openTelegram(text?: string): void {
    const clean = (text || '').trim();
    if (clean) {
      this.triggerUri(`tg://msg?text=${encodeURIComponent(clean)}`);
    } else {
      this.triggerUri('tg://resolve');
    }
  }

  /**
   * Opens YouTube or searches a video in the native YouTube Android app
   */
  static openYouTube(searchQuery?: string): void {
    const clean = (searchQuery || '').trim();
    if (clean) {
      this.triggerUri(`vnd.youtube://results?search_query=${encodeURIComponent(clean)}`);
    } else {
      this.triggerUri('vnd.youtube://');
    }
  }

  /**
   * Performs a Google Search or opens a URL in the native browser / Google app
   */
  static searchGoogle(query: string): void {
    const clean = query.trim();
    this.triggerUri(`https://www.google.com/search?q=${encodeURIComponent(clean)}`);
  }

  /**
   * Opens Google Chrome Android app via intent://
   */
  static openChrome(urlOrQuery?: string): void {
    const clean = (urlOrQuery || '').trim();
    if (clean && /^https?:\/\//i.test(clean)) {
      const withoutProtocol = clean.replace(/^https?:\/\//i, '');
      const scheme = clean.toLowerCase().startsWith('https') ? 'https' : 'http';
      this.triggerUri(
        `intent://${withoutProtocol}#Intent;scheme=${scheme};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(clean)};end`
      );
    } else if (clean) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(clean)}`;
      this.triggerUri(
        `intent://www.google.com/search?q=${encodeURIComponent(clean)}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(searchUrl)};end`
      );
    } else {
      this.triggerUri(
        'intent://www.google.com#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Fwww.google.com;end'
      );
    }
  }

  /**
   * Opens the native Android Calculator app via Intent category APP_CALCULATOR
   */
  static openCalculator(): void {
    this.triggerUri(
      'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end'
    );
  }

  /**
   * Opens Google Maps on a specific query / nearby place (geo:0,0?q=...)
   */
  static openMaps(query?: string): void {
    const clean = (query || '').trim();
    if (clean) {
      this.triggerUri(`geo:0,0?q=${encodeURIComponent(clean)}`);
    } else {
      this.triggerUri('geo:0,0?q=');
    }
  }

  /**
   * Opens Gmail or composes an email via mailto: or Gmail package intent
   */
  static openGmail(options?: { to?: string; subject?: string; body?: string }): void {
    if (options?.to || options?.subject || options?.body) {
      const to = options.to || '';
      const params = new URLSearchParams();
      if (options.subject) params.set('subject', options.subject);
      if (options.body) params.set('body', options.body);
      const qs = params.toString();
      this.triggerUri(`mailto:${to}${qs ? `?${qs}` : ''}`);
    } else {
      this.triggerUri(
        'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_EMAIL;package=com.google.android.gm;end'
      );
    }
  }

  /**
   * Launches any installed app or tool by Spotlight appId and optional query context
   */
  static launchAppById(appId: string, rawQuery?: string, explicitUrl?: string): void {
    const q = (rawQuery || '').trim();

    switch (appId) {
      case 'spotify': {
        const songQuery = q
          .replace(/^(?:spotify\s+connect|spotify|reproducir|escuchar\s+musica|escuchar|cancion|letras?\s+de|letra)\s*/i, '')
          .trim();
        this.openSpotify(songQuery);
        return;
      }

      case 'whatsapp': {
        const cleaned = q.replace(/^(?:whatsapp|nota\s+de\s+voz|audio\s+a|wa)\s*/i, '').trim();
        if (/^\+?\d{8,15}$/.test(cleaned.replace(/\s+/g, ''))) {
          this.openWhatsApp({ phone: cleaned.replace(/\s+/g, '') });
        } else if (cleaned && cleaned.toLowerCase() !== 'whatsapp') {
          this.openWhatsApp({ text: cleaned });
        } else {
          this.openWhatsApp();
        }
        return;
      }

      case 'telegram':
        this.openTelegram(q.replace(/^(?:telegram|tg)\s*/i, '').trim());
        return;

      case 'youtube': {
        const ytQuery = q.replace(/^(?:youtube|ver\s+video|video)\s*/i, '').trim();
        this.openYouTube(ytQuery);
        return;
      }

      case 'chrome': {
        if (explicitUrl) {
          this.triggerUri(explicitUrl);
        } else {
          const webQuery = q.replace(/^(?:chrome|google\s+chrome|buscar)\s*/i, '').trim();
          this.openChrome(webQuery);
        }
        return;
      }

      case 'calc':
        this.openCalculator();
        return;

      case 'maps': {
        const mapQuery = q.replace(/^(?:google\s+maps|maps|mapa)\s*/i, '').trim();
        this.openMaps(mapQuery);
        return;
      }

      case 'gmail':
        this.openGmail();
        return;

      case 'finanzas':
        this.triggerUri(
          'intent://home#Intent;scheme=mercadopago;package=com.mercadopago.wallet;S.browser_fallback_url=https%3A%2F%2Fwww.mercadopago.com.ar;end'
        );
        return;

      case 'camara':
      case 'qr':
        this.triggerUri('intent://#Intent;action=android.media.action.STILL_IMAGE_CAMERA;end');
        return;

      case 'clock':
        this.triggerUri('intent://#Intent;action=android.intent.action.SHOW_ALARMS;end');
        return;

      case 'timer':
        this.triggerUri('intent://#Intent;action=android.intent.action.SET_TIMER;end');
        return;

      case 'calendar':
        this.triggerUri(
          'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALENDAR;end'
        );
        return;

      case 'control':
        this.triggerUri('intent://#Intent;action=android.settings.SETTINGS;end');
        return;

      case 'files':
        this.triggerUri('intent://#Intent;action=android.intent.action.VIEW_DOWNLOADS;end');
        return;

      case 'terminal':
        this.triggerUri(
          'intent://#Intent;package=com.termux;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end'
        );
        return;

      case 'translator': {
        const transQuery = q.replace(/^(?:traductor|traducir|translate)\s*/i, '').trim();
        this.triggerUri(
          `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(transQuery)}&op=translate`
        );
        return;
      }

      case 'movies': {
        const movieQuery = q.replace(/^(?:peli|pelicula|serie|donde\s+ver)\s*/i, '').trim();
        this.searchGoogle(movieQuery ? `donde ver ${movieQuery}` : 'peliculas y series en streaming');
        return;
      }

      default:
        if (explicitUrl) {
          this.triggerUri(explicitUrl);
        } else {
          this.searchGoogle(q || appId);
        }
    }
  }

  /**
   * Executes Android system settings / hardware intents when triggered from Spotlight
   */
  static triggerDeviceCommand(command: string): void {
    const cmd = command.toLowerCase();
    if (cmd.includes('wifi')) {
      this.triggerUri('intent://#Intent;action=android.settings.WIFI_SETTINGS;end');
    } else if (cmd.includes('bluetooth')) {
      this.triggerUri('intent://#Intent;action=android.settings.BLUETOOTH_SETTINGS;end');
    } else if (cmd.includes('brightness') || cmd.includes('brillo') || cmd.includes('pantalla')) {
      this.triggerUri('intent://#Intent;action=android.settings.DISPLAY_SETTINGS;end');
    } else if (cmd.includes('volume') || cmd.includes('mute') || cmd.includes('unmute') || cmd.includes('sonido')) {
      this.triggerUri('intent://#Intent;action=android.settings.SOUND_SETTINGS;end');
    } else {
      this.triggerUri('intent://#Intent;action=android.settings.SETTINGS;end');
    }
  }
}
