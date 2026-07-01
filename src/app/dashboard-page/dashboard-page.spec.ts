import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './dashboard-page';
import { AuthService } from '../services/auth.service';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(DashboardPage);
    await fixture.whenStable();
  });

  it('should render the employee dashboard by default', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome, Chloe');
    expect(compiled.textContent).toContain('Assigned to Me');
    expect(compiled.textContent).toContain('My recent requests');
  });

  it('should render the approval dashboard for AdminIT', () => {
    auth.selectMockUser('alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome, Alice');
    expect(compiled.textContent).toContain('Pending Requests');
    expect(compiled.textContent).toContain('Requests awaiting approval');
  });
});
