import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as BillsActions from './bills.actions';
import { BillsEffects } from './bills.effects';

describe('BillsEffects', () => {
  let actions: Observable<Action>;
  let effects: BillsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        BillsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(BillsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: BillsActions.initBills() });

      const expected = hot('-a-|', {
        a: BillsActions.loadBillsSuccess({ bills: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
