import * as WebBrowser from 'expo-web-browser';

import { API_URL } from '@/lib/api';

/** Open a page of the Servhive website (legal pages, help) in an in-app browser. */
export function openSite(path: string) {
  return WebBrowser.openBrowserAsync(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`);
}

export const openLegal = (slug: 'terms' | 'provider' | 'protection' | 'privacy') => openSite(`/legal/${slug}`);
