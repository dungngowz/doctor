import { dataTableParamsState } from '@/store/param-data'
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { useRecoilState } from 'recoil'
import { HeadCellsType } from './type'

interface IEnhancedTableHead {
  headCells?: HeadCellsType[]
}

export const EnhancedTableHead = ({ headCells = [] }: IEnhancedTableHead) => {
  // Recoil state
  const [dataTableParams, setDataTableParams] = useRecoilState(dataTableParamsState)

  // Handle click sort
  const handleChangeSort = (headCell: any) => {
    const { id, disableSort } = headCell
    if (disableSort) return false
    if (dataTableParams.orderBy == id) {
      setDataTableParams({
        ...dataTableParams,
        orderSort: dataTableParams.orderSort === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setDataTableParams({
        ...dataTableParams,
        orderBy: id,
        orderSort: 'desc',
      })
    }
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, i) => (
          <TableCell
            key={i}
            align={headCell.numeric ? 'right' : 'left' || headCell?.align}
            padding={headCell?.disablePadding ? 'none' : 'normal'}
            colSpan={headCell?.colSpan}
            width={headCell?.width}
          >
            <TableSortLabel
              active={headCell.id == dataTableParams.orderBy ? true : false}
              hideSortIcon={headCell.disableSort ? true : false}
              direction={dataTableParams.orderSort as 'asc' | 'desc'}
              onClick={() => handleChangeSort(headCell)}
              sx={{ cursor: headCell.disableSort ? 'default' : 'pointer' }}
            >
              {headCell.title}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
