import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { useEffect } from 'react';
import theme from '../src/theme';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles: Element | null = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
      </ThemeProvider>
    </StylesProvider>
  );
}
export default MyApp
