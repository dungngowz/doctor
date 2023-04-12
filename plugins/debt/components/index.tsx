import { IconButtonEdit, MainDataTable, SearchField } from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { ProductItem } from '@/plugins/order/components/product-item'
import { totalProductPrice } from '@/plugins/order/handlers'
import { openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import { calcIndexDataTable, formatDate, initChannel, t } from '@/utils'
import { Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getDebtApi } from '../api'
import { debtActivedState, debtListState } from '../store'
import { DebtType } from '../type'
import { Filter } from './filter'
import { ModalDetail } from './modal-detail'

export const DebtContainer = () => {
  // Recoil
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)

  const debtList = useRecoilValue<DebtType[]>(debtListState)
  const setDebtActive = useSetRecoilState<DebtType | any>(debtActivedState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('debtIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },

    {
      id: 'code',
      title: t('debtCodeHeadCell'),
      disableSort: false,
      numeric: false,
      width: 100,
      disablePadding: true,
    },

    {
      id: 'contractorId',
      title: t('debtContractorNameHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'projectId',
      title: t('debtProjectNameHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('debtAddressHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('debtDetailHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('debtFinalPriceHeadCell'),
      disableSort: true,
      numeric: true,
    },

    {
      id: 'createdAt',
      title: t('debtCreatedAtHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'action',
      title: '',
      disableSort: true,
      numeric: false,
      width: 100,
    },
  ]

  const handleOpenDetail = (debt?: DebtType) => {
    setOpenModalDetail(!openModalDetail)
    setDebtActive(debt)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const debtParams = {
      statusAccountant: 1,
      isFinish: 1,
    }

    getDebtApi(debtParams)

    const channel = initChannel()
    channel.bind(`order.update`, function () {
      getDebtApi(debtParams)
    })
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {debtList?.length > 0 &&
          debtList.map((item: DebtType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>

              <TableCell padding="checkbox">
                <Highlighter searchWords={[params.keyword]} textToHighlight={item.code} />
              </TableCell>

              <TableCell>{item?.contract?.quote?.contractor?.name}</TableCell>

              <TableCell>{item?.contract.quote?.project?.name}</TableCell>

              <TableCell>
                {item?.contract?.quote?.district?.title +
                  ', ' +
                  item?.contract?.quote?.province?.title}
              </TableCell>

              <TableCell>
                <ProductItem item={item.contract?.quote?.items} />
              </TableCell>

              <TableCell align="right">
                {totalProductPrice(item?.discount, (item?.contract.quote?.items as any) ?? [])}
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>

              <TableCell align="right">
                <IconButtonEdit />
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail />}
    </>
  )
}
