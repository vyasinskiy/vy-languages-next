import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { ComponentProps } from "./lib/types";
import './global.css';

export const metadata: Metadata = {
  title: "Main",
  description: "Main page",
};

export default function RootLayout(props: ComponentProps) {
  return (
    <html lang="en">
      <body style={{height: '100vh', overflow: 'hidden'}}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <main style={{ height: '100%' }}>
              {props.children}
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
