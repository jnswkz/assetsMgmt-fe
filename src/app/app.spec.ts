import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { LoginPage } from './login-page/login-page';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          {
            path: 'login',
            component: LoginPage,
          },
        ]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render login without the app shell', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);
    await router.navigateByUrl('/login');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-sidenav-container')).toBeNull();
    expect(compiled.querySelector('mat-toolbar')).toBeNull();
    expect(compiled.querySelector('app-sidebar-nav')).toBeNull();
    expect(compiled.querySelector('app-login-page')).toBeTruthy();
  });
});
