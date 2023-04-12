import { Skeleton, Stack } from '@mui/material'
import { brand } from '../colors/brand'

export const MenuItemSkeleton = () => {
  return (
    <Stack spacing={2} px={1}>
      {[...Array(4)].map((item, index) => (
        <Skeleton
          key={index}
          sx={{ borderRadius: '8px', bgcolor: brand.gray200 }}
          animation="wave"
          variant="rounded"
          height={30}
        />
      ))}
    </Stack>
  )
}
