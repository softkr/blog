import reducer, { initialState, setLight, setDark } from '../theme';

describe('theme reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      theme: 'light',
    });
  });

  it('should handle SET_LIGHT', () => {
    const action = setLight();
    expect(reducer(initialState, action)).toEqual({
      theme: 'light',
    });

    const darkState = { theme: 'dark' };
    expect(reducer(darkState, action)).toEqual({
      theme: 'light',
    });
  });

  it('should handle SET_DARK', () => {
    const action = setDark();
    expect(reducer(initialState, action)).toEqual({
      theme: 'dark',
    });
  });
});
