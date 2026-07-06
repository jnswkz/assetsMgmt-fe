import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SidebarNav } from './sidebar-nav';

describe('SidebarNav', () => {
  let component: SidebarNav;
  let fixture: ComponentFixture<SidebarNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNav],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show admin navigation for AdminIT', () => {
    fixture.componentRef.setInput('role', 'AdminIT');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Pending Approvals');
    expect(compiled.textContent).toContain('Management');
    expect(compiled.textContent).toContain('Users');
    expect(compiled.textContent).toContain('AI Assistant');
  });

  it('should show management navigation for Manager without admin items', () => {
    fixture.componentRef.setInput('role', 'Manager');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Pending Approvals');
    expect(compiled.textContent).toContain('Management');
    expect(compiled.textContent).not.toContain('Users');
  });

  it('should show employee navigation without approvals or management items', () => {
    fixture.componentRef.setInput('role', 'Employee');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const sectionLabels = Array.from(compiled.querySelectorAll('.nav-group__label')).map(
      label => label.textContent?.trim()
    );

    expect(compiled.textContent).toContain('My Requests');
    expect(compiled.textContent).toContain('AI Assistant');
    expect(compiled.textContent).not.toContain('Pending Approvals');
    expect(sectionLabels).not.toContain('Management');
  });

  it('should place the assistant group last above the settings footer', () => {
    fixture.componentRef.setInput('role', 'Employee');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const sectionLabels = Array.from(compiled.querySelectorAll('.nav-group__label')).map(
      label => label.textContent?.trim()
    );
    const footer = compiled.querySelector('.sidebar-nav__footer');

    expect(sectionLabels.at(-1)).toBe('Assistant');
    expect(footer?.textContent).toContain('Settings');
    expect(compiled.querySelector('.nav-groups')?.lastElementChild?.textContent).toContain('AI Assistant');
  });
});
