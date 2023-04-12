import { Backdrop, Box, CircularProgress } from '@mui/material'

/* Defining the props that the component will receive. */
interface ILoading {
  open?: boolean
}

/* A function that returns a JSX element. */
export const Loading = (props: ILoading) => {
  const { open = false } = props

  return (
    <>
      {open && (
        <Backdrop
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 9999, bgcolor: 'transparent' }}
          open={open}
        >
          <Box className="loading-wrapper">
            <CircularProgress color="primary" size={'1.2rem'} />
          </Box>
        </Backdrop>
      )}
    </>
  )
}
