import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSkeleton } from './loading-skeleton';

describe('LoadingSkeleton', () => {
  let fixture: ComponentFixture<LoadingSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadingSkeleton] }).compileComponents();
    fixture = TestBed.createComponent(LoadingSkeleton);
  });

  it('renders the requested number of accessible table placeholders', () => {
    fixture.componentRef.setInput('rows', 3);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.table-row')).toHaveLength(3);
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Loading content');
  });

  it('renders the dashboard layout', () => {
    fixture.componentRef.setInput('variant', 'dashboard');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dashboard-panels')).toBeTruthy();
  });
});
