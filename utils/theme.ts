import { createTheme, ThemeOptions } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      contrastText: '#fff',
    },
  },

  typography: {
    fontFamily: 'Inter, sans-serif',
    htmlFontSize: 18,
  },
  // CUSTOM THEME COMPONENTS
} as ThemeOptions)

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    filledTonal: true
  }
}
