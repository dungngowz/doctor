import { Leaderboard } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'
import { blue, red, yellow } from '@mui/material/colors'
import { ReactNode } from 'react'

type IProps = {
  bgcolor?: 'white' | 'red' | 'blue' | 'yellow' | 'green' | 'indigo'
  icon?: ReactNode
  count?: any
  title: ReactNode
  increase?: ReactNode
}

export const Statistics = (props: IProps) => {
  const {
    bgcolor = 'white',
    icon = <Leaderboard color="info" />,
    count = 100,
    title = '',
    increase,
  } = props

  let backgroundColor = '#fff'
  let textColor = '#111'
  switch (bgcolor) {
    case 'white':
      backgroundColor = '#fff'
      break
    case 'indigo':
      backgroundColor = '#6610f2'
      textColor = '#fff'
      break
    case 'red':
      backgroundColor = red[600]
      textColor = '#fff'
      break
    case 'blue':
      backgroundColor = blue[600]
      textColor = '#fff'
      break
    case 'yellow':
      backgroundColor = yellow[600]
      textColor = '#fff'
      break

    case 'green':
      backgroundColor = '#50cd89'
      textColor = '#fff'
      break
    default:
      break
  }
  return (
    <Box bgcolor={backgroundColor} padding={'26px'} borderRadius={1} className="widget-wrapper">
      <Stack
        spacing={0.5}
        direction="row"
        alignItems={'center'}
        justifyContent="space-between"
        py="8px"
      >
        <Box>{icon}</Box>
        <Stack>
          <Box color={textColor} fontSize="14px" textAlign={'end'}>
            {title}
          </Box>
          <Box pt={'6px'} fontWeight={600} fontSize={'12px'} textAlign="end">
            {increase}
          </Box>

          <Typography fontSize={'26px'} color={textColor} fontWeight={600} textAlign={'end'}>
            {count}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}
