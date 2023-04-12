import { Box, CircularProgress } from '@mui/material'

export const ChartLoading = () => {
  return (
    <Box minHeight={300} display="flex" alignItems={'center'} justifyContent="center">
      <CircularProgress />
    </Box>
  )
}
