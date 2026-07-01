import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { MyAssetsPage } from './my-assets-page';

describe('MyAssetsPage', () => {
  let fixture: ComponentFixture<MyAssetsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAssetsPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(MyAssetsPage);
    await fixture.whenStable();
  });

  it('should show the assigned assets from the Figma screen', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('My assets');
    expect(compiled.textContent).toContain('Hardware currently assigned to you.');
    expect(compiled.textContent).toContain('AH-0001');
    expect(compiled.textContent).toContain('MacBook Pro 14"');
    expect(compiled.textContent).toContain('AH-0008');
    expect(compiled.textContent).toContain('Dell UltraSharp 27');
    expect(compiled.textContent).toContain('AH-0016');
    expect(compiled.textContent).toContain('Logitech MX Master 3S');
  });

  it('should keep the same assigned assets across all mock roles', () => {
    const roleUsers = ['alice', 'ben', 'chloe'];

    for (const username of roleUsers) {
      auth.selectMockUser(username);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelectorAll('.asset-card').length).toBe(3);
      expect(compiled.textContent).toContain('AH-0001');
      expect(compiled.textContent).toContain('AH-0008');
      expect(compiled.textContent).toContain('AH-0016');
    }
  });

  it('should update the profile area for the current mock user', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alice Morgan');
    expect(compiled.textContent).toContain('IT');
  });

  it('should filter assigned cards from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#my-assets-global-search');
    search!.value = 'Dell';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.asset-card').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0008');
    expect(compiled.textContent).not.toContain('AH-0001');
  });
});
