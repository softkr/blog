import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { setLight, setDark } from 'reducers/theme';

import { light, dark } from 'assets/theme';

import GlobalStyles from 'components/GlobalStyles';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  let isSystemDarkMode = null;
  if (typeof window !== 'undefined') {
    isSystemDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
  }

  let localTheme = null;
  if (typeof localStorage !== 'undefined') {
    localTheme = localStorage.getItem('theme');
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(nextTheme === 'dark' ? setDark() : setLight());
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;

      if (systemDark && !saved) {
        dispatch(systemDark ? setDark() : setLight());
      } else if (saved) {
        dispatch(saved === 'dark' ? setDark() : setLight());
      }
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme === 'light' ? light : dark}>
      <GlobalStyles />
      <Header toggleTheme={toggleTheme} />
      <Body>{children}</Body>
      <Footer />
    </ThemeProvider>
  );
};

export default Layout;
