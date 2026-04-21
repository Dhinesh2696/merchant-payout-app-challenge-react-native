import reducer, { setOfflineStatus } from '../appReducer';

describe('appReducer', () => {
  const initialState = {
    isOffline: false,
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setOfflineStatus', () => {
    const actual = reducer(initialState, setOfflineStatus(true));
    expect(actual.isOffline).toBe(true);

    const actualFalse = reducer({ isOffline: true }, setOfflineStatus(false));
    expect(actualFalse.isOffline).toBe(false);
  });
});
