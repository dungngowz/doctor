import { formatPrice, formatQty, t, totalPriceQuote } from '@/utils'
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { red } from '@mui/material/colors'
import { ReactNode } from 'react'

type DetailType = {
  title?: string
  qty: number
  price: number
  productId: number
  unit: string
}

type IProps = {
  products: DetailType[]
  slotTableRow?: ReactNode
}

export const ProductDataTable = (props: IProps) => {
  const { products = [], slotTableRow } = props

  const totalPrice = (item: DetailType) => {
    return formatPrice(item.price * item.qty ?? 0)
  }

  return (
    <>
      {products?.length > 0 && (
        <TableContainer component={Paper} className="product-data-table">
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>{t('orderNameProductLabel')}</TableCell>
                <TableCell>{t('orderUnitProductLabel')}</TableCell>
                <TableCell align="right">{t('orderQtyProductLabel')}</TableCell>
                <TableCell align="right">{t('orderPriceProductLabel')}</TableCell>
                <TableCell align="right">{t('orderTotalPriceItemProductLabel')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index: number) => (
                <TableRow key={product.productId}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {product.title}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {product.unit}
                  </TableCell>

                  <TableCell align="right" component="th" scope="row">
                    {formatQty(product.qty)}
                  </TableCell>

                  <TableCell align="right" component="th" scope="row">
                    {formatPrice(product.price)}
                  </TableCell>

                  <TableCell align="right" component="th" scope="row">
                    {totalPrice(product)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell colSpan={8}>
                  <Box display={'flex'} justifyContent="flex-end">
                    <Stack
                      spacing={1}
                      direction={'row'}
                      minWidth="160px"
                      // width={'100%'}
                      justifyContent="space-between"
                    >
                      <Typography fontSize={'13px'} fontWeight={600}>
                        {t('contractTotalPriceItemLabel')}:
                      </Typography>

                      <Typography fontSize={'14px'} fontWeight={700} color={red[600]}>
                        {totalPriceQuote(products as any)}
                      </Typography>
                    </Stack>
                  </Box>
                </TableCell>
              </TableRow>

              {slotTableRow}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
