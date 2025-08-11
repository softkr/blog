export const initialState = {
  theme: 'light',
};

// action type 정의
export const SET_LIGHT = 'setLight';
export const SET_DARK = 'setDark';

// action creator 정의
export const setLight = () => ({ type: SET_LIGHT });
export const setDark = () => ({ type: SET_DARK });

// reducer 정의
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIGHT:
      return { ...state, theme: 'light' };
    case SET_DARK:
      return { ...state, theme: 'dark' };
    default:
      return state;
  }
};

export default reducer;
