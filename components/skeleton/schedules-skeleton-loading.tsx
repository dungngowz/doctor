/* eslint-disable no-constant-condition */
import { Box, Divider, Fade, Grid, Skeleton, Stack } from '@mui/material'
import { brand } from '../colors/brand'

export const SchedulesLoading = () => {
  return (
    <>
      {[...Array(3)].map((item, index) => (
        <Fade key={index} in={true} {...(true ? { timeout: 1000 } : {})}>
          <Grid item xs={12} md={6} xl={4}>
            <Box className="skeleton-schedule">
              <Stack height={180}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={'20%'}
                  sx={{ bgcolor: brand.gray100 }}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={'40%'}
                  sx={{ bgcolor: brand.gray100 }}
                />
              </Stack>
              <Divider sx={{ borderColor: brand.gray200 }} />
              <Stack direction={'row'}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={'20%'}
                  sx={{ bgcolor: brand.gray100, fontSize: '2rem' }}
                />
              </Stack>
            </Box>
          </Grid>
        </Fade>
      ))}
    </>
  )
}
