import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthService, SessionState } from '../services/auth.service';
import { roleGuard } from './role.guard';
import { Role } from '../models/nav-item';

describe('roleGuard', () => {
  function setup({
    platformId,
    role,
    isSessionResolved,
    waitState = 'authenticated',
  }: {
    platformId: 'browser' | 'server';
    role: Role | null;
    isSessionResolved: boolean;
    waitState?: SessionState;
  }) {
    const parseUrl = vi.fn((url: string) => ({ redirectedTo: url }) as unknown as UrlTree);
    const auth = {
      ensureSessionRestoreStarted: vi.fn(),
      isSessionResolved: vi.fn(() => isSessionResolved),
      role: vi.fn(() => role),
      waitForResolvedSession: vi.fn(() => of(waitState)),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: { parseUrl } },
      ],
    });

    const route = new ActivatedRouteSnapshot();
    route.data = { allowedRoles: ['AdminIT'] };

    return { auth, parseUrl, route };
  }

  it('should allow SSR to continue without redirecting to forbidden', () => {
    const { auth, parseUrl, route } = setup({
      platformId: 'server',
      role: null,
      isSessionResolved: false,
    });

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(result).toBe(true);
    expect(auth.ensureSessionRestoreStarted).not.toHaveBeenCalled();
    expect(parseUrl).not.toHaveBeenCalled();
  });

  it('should allow an AdminIT user once the browser session resolves', async () => {
    const { auth, parseUrl, route } = setup({
      platformId: 'browser',
      role: 'AdminIT',
      isSessionResolved: false,
    });

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(auth.ensureSessionRestoreStarted).toHaveBeenCalled();
    expect(result).not.toBe(true);

    const value = await firstValueFrom(result as ReturnType<typeof of>);
    expect(value).toBe(true);
    expect(parseUrl).not.toHaveBeenCalled();
  });

  it('should redirect unauthorized browser users to forbidden', async () => {
    const { auth, parseUrl, route } = setup({
      platformId: 'browser',
      role: 'Employee',
      isSessionResolved: false,
    });

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as never));

    expect(auth.ensureSessionRestoreStarted).toHaveBeenCalled();

    const value = await firstValueFrom(result as ReturnType<typeof of>);
    expect(parseUrl).toHaveBeenCalledWith('/forbidden');
    expect((value as unknown as { redirectedTo: string }).redirectedTo).toBe('/forbidden');
  });
});
