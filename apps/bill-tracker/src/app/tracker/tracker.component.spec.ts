import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerComponent } from './tracker.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

const initialState = {
  // Define the mock initial state of the store
  bills: [],
};

describe('TrackerComponent', () => {
  let component: TrackerComponent;
  let fixture: ComponentFixture<TrackerComponent>;
  let mockStore: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerComponent],
      providers: [
        provideMockStore({ initialState }), // Provide the mock store
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackerComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as MockStore;

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
