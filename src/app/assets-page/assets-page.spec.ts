import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetsPage } from './assets-page';
import { AuthService } from '../services/auth.service';

describe('AssetsPage', () => {
  let fixture: ComponentFixture<AssetsPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(AssetsPage);
    await fixture.whenStable();
  });

  it('should show asset management actions for AdminIT', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('New asset');
    expect(compiled.textContent).toContain('AH-0001');
    expect(compiled.querySelector('[aria-label="Show QR details for AH-0001"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Edit AH-0001"]')).toBeNull();
  });

  it('should show QR actions for Employee without the new asset action', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('New asset');
    expect(compiled.querySelector('[aria-label="Show QR details for AH-0001"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Request AH-0001"]')).toBeNull();
    expect(compiled.querySelector('[aria-label="Edit AH-0001"]')).toBeNull();
  });

  it('should open and close the full asset information page from the QR action', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const qrButton = compiled.querySelector<HTMLButtonElement>('[aria-label="Show QR details for AH-0001"]');
    qrButton?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Back to assets');
    expect(compiled.textContent).toContain('Scan to look up');
    expect(compiled.textContent).toContain('Acquisition cost');
    expect(compiled.textContent).toContain('Standard issue dev laptop.');

    compiled.querySelector<HTMLButtonElement>('.back-button')?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Every physical asset unit');
    expect(compiled.textContent).not.toContain('Back to assets');
  });

  it('should filter asset rows from the top search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#assets-global-search');
    search!.value = 'Chloe Davis';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(3);
    expect(compiled.textContent).toContain('AH-0001');
    expect(compiled.textContent).toContain('AH-0008');
    expect(compiled.textContent).toContain('AH-0016');
    expect(compiled.textContent).toContain('Showing 3 of 20');
  });

  it('should combine asset search with status and model filters', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#asset-search');
    const statusFilter = compiled.querySelector<HTMLSelectElement>('[aria-label="Filter by status"]');
    const modelFilter = compiled.querySelector<HTMLSelectElement>('[aria-label="Filter by model"]');
    search!.value = 'Dell';
    search!.dispatchEvent(new Event('input'));
    statusFilter!.value = 'In stock';
    statusFilter!.dispatchEvent(new Event('change'));
    modelFilter!.value = 'Dell UltraSharp 27';
    modelFilter!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('AH-0010');
    expect(compiled.textContent).not.toContain('AH-0008');
    expect(compiled.textContent).toContain('Showing 1 of 20');
  });
});
