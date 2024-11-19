import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerComponent } from './tracker.component';


describe('TrackerComponent', () => {
  let component: TrackerComponent;
  let fixture: ComponentFixture<TrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should render title', () => {
    const fixture = TestBed.createComponent(TrackerComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Bill Tracker'
    );
  });

  it(`should have as title 'bill-tracker'`, () => {
    const fixture = TestBed.createComponent(TrackerComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('bill-tracker');
  });
});
