import { ErrorFallback, Loading } from '@/components'
import { GlobalComponent } from '@/components/global'
import { MainLayout } from '@/layouts'
import { AppPropsWithLayout } from '@/types'
import { createEmotionCache, theme } from '@/utils'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Suspense } from 'react'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { ErrorBoundary } from 'react-error-boundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import 'styles/global.scss'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const Layout = Component.Layout ?? MainLayout

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <ToastContainer theme="colored" autoClose={1500} />
        <RecoilRoot>
          <RecoilNexus />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading open={true} />}>
              <Layout>
                <CssBaseline />
                <Component {...pageProps} />
                <GlobalComponent />
              </Layout>
            </Suspense>
          </ErrorBoundary>
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
