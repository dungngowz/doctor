import { ButtonHome, ButtonRetry } from '@/components'
import { t } from '@/utils'

import { Box } from '@mui/material'
import { Container } from '@mui/system'
import { useEffect } from 'react'

export type ErrorFallbackProps = {
  error: any
  resetErrorBoundary: any
}

/** A React component that is used to display the error message. 
 * It renders a container with a title, a message, and two buttons
 * 
 * @example
 * throw new Object({
    code: 500,
    message: 'A selector that is used to get the post categories from the API',
  })
*/
export const ErrorFallback = ({ error }: ErrorFallbackProps) => {
  useEffect(() => {
    document.title = error.code ? `${error.code}: ${error.message}` : error
  })

  console.error('ErrorFallback', error)

  const onHandleRetry = () => {
    location.reload()
  }

  return (
    <Container>
      <Box className="group-error">
        <Box className="group-error__content">
          {error.code && error.message && (
            <>
              <Box className="group-error__code">{error.code}</Box>
              <Box className="group-error__separate">|</Box>
              <Box className="group-error__message">{error.message}</Box>
            </>
          )}
          {(typeof error == 'string' || typeof error == 'number') && (
            <Box className="group-error__message">{error}</Box>
          )}
        </Box>

        <Box className="group-error__buttons">
          <ButtonRetry btnText={t('retry')} marginRight={1} handleClick={onHandleRetry} />
          <ButtonHome btnText={t('home')}></ButtonHome>
        </Box>
      </Box>
    </Container>
  )
}
