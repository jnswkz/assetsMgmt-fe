import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetCatalogPage } from './asset-catalog-page';
import { AuthService } from '../services/auth.service';

describe('AssetCatalogPage', () => {
  let fixture: ComponentFixture<AssetCatalogPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetCatalogPage],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(AssetCatalogPage);
    await fixture.whenStable();
  });

  it('should show catalog management actions for AdminIT', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('New model');
    expect(compiled.querySelector('[aria-label^="Edit MacBook Pro 14"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label^="Delete MacBook Pro 14"]')).toBeTruthy();
  });

  it('should show request actions for Employee', () => {
    auth.selectMockUser('chloe');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Request model');
    expect(compiled.querySelector('[aria-label^="Request MacBook Pro 14"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label^="Edit MacBook Pro 14"]')).toBeNull();
  });

  it('should filter model rows with the local model search', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector<HTMLInputElement>('#model-search');
    search!.value = 'Cisco';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('Cisco Catalyst 9200');
    expect(compiled.textContent).not.toContain('MacBook Pro 14"');
    expect(compiled.textContent).toContain('Showing 1 of 8');
  });

  it('should combine top search with the category filter', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const globalSearch = compiled.querySelector<HTMLInputElement>('#catalog-global-search');
    const categoryFilter = compiled.querySelector<HTMLSelectElement>('[aria-label="Filter by category"]');
    globalSearch!.value = 'Apple';
    globalSearch!.dispatchEvent(new Event('input'));
    categoryFilter!.value = 'Tablet';
    categoryFilter!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(compiled.querySelectorAll('tbody tr').length).toBe(1);
    expect(compiled.textContent).toContain('iPad Air');
    expect(compiled.textContent).not.toContain('iPhone 15 Pro');
    expect(compiled.textContent).toContain('Showing 1 of 8');
  });
});
