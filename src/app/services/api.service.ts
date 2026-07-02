import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

/**
 * Thin HTTP wrapper: prepends the API base URL and builds query strings.
 * Auth headers and 401 refresh are handled globally by the auth interceptor.
 *
 * All calls are no-ops during server-side render: the server has no JWT (tokens
 * live in localStorage), so authenticated requests would 401 and — via the HTTP
 * transfer cache — replay that 401 on the client, clearing the session. The
 * browser re-runs each component's load after hydration and fetches for real.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly baseUrl = environment.apiBaseUrl;

  get<T>(path: string, params?: QueryParams): Observable<T> {
    if (!this.isBrowser) {
      return EMPTY;
    }
    return this.http.get<T>(this.url(path), { params: toHttpParams(params) });
  }

  getBlob(path: string, params?: QueryParams): Observable<Blob> {
    if (!this.isBrowser) {
      return EMPTY;
    }
    return this.http.get(this.url(path), {
      params: toHttpParams(params),
      responseType: 'blob',
    });
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    if (!this.isBrowser) {
      return EMPTY;
    }
    return this.http.post<T>(this.url(path), body ?? {});
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    if (!this.isBrowser) {
      return EMPTY;
    }
    return this.http.put<T>(this.url(path), body ?? {});
  }

  delete<T>(path: string): Observable<T> {
    if (!this.isBrowser) {
      return EMPTY;
    }
    return this.http.delete<T>(this.url(path));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
}

function toHttpParams(params?: QueryParams): HttpParams {
  let httpParams = new HttpParams();
  if (!params) {
    return httpParams;
  }
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      httpParams = httpParams.set(key, String(value));
    }
  }
  return httpParams;
}
