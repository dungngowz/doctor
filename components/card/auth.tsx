import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'

/* A type checking for the props. */
interface ICardAuth {
  children?: ReactNode
  vector?: string
  title?: string
  description?: string
}

export const CardAuth = (props: ICardAuth) => {
  const { children, vector = '', title = '', description = '' } = props

  return (
    <Box className="card-auth-wrapper">
      <Box width={'100%'}>
        <Card elevation={0} className="card-auth-wrapper--main">
          <Grid container spacing={{ xs: 0, md: 8 }}>
            {/* Rendering the icon on the left side of the card. */}
            <Grid item xs={12} md={6} display={{ xs: 'none', md: 'flex' }}>
              <i className={vector}></i>
            </Grid>

            {/* Rendering the children of the component. */}
            <Grid item xs={12} md={6} className="card-auth-wrapper--content">
              <Stack width="100%">
                {/* A ternary operator. If title is true, then it will render the Typography component. */}
                {title && (
                  <Typography variant="h5" textAlign="center" fontWeight={500}>
                    {title}
                  </Typography>
                )}
                {description && (
                  <Typography
                    paddingTop={2}
                    variant="subtitle1"
                    textAlign="center"
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></Typography>
                )}

                <Box width="100%" paddingTop={4}>
                  {children}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  )
}
