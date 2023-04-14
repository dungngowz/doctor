import { Skeleton, TableCell, TableRow } from '@mui/material'
import { grey } from '@mui/material/colors'

export const TableSkeleton = (props: any) => {
  const { length } = props

  return (
    <>
      {[...Array(3)].map((item, index) => (
        <TableRow tabIndex={-1} key={index}>
          {[...Array(length)].map((item, i) => (
            <TableCell key={i}>
              <Skeleton variant="text" animation="wave" sx={{ my: '12px', bgcolor: grey[100] }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
