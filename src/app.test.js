import {createOrderWrapper, clearWrapper} from './wrapper-fns.js'

beforeEach(() => {
    clearWrapper();
});

describe('Success Cases', () => {
    test('successful order creation', () => {
      expect(createOrderWrapper('personA@gmail.com', [], '221B, Bakers Street, London')).toStrictEqual({
        error: 'Invalid order list'
      });
    });
});
  