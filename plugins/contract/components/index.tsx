import {
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
  StatusProgress,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { getAllContractorOptionsApi, getAllProjectOptionsApi } from '@/meta/common'
import { ProductItem } from '@/plugins/order/components/product-item'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  initChannel,
  isPermissionDelete,
  isPermissionUpdate,
  t,
} from '@/utils'
import { Visibility } from '@mui/icons-material'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getContractApi } from '../api'
import { contractActiveState, contractListState } from '../store'
import { ContractType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ContractContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const contractList = useRecoilValue<ContractType[]>(contractListState)
  const setContractActive = useSetRecoilState<ContractType | any>(contractActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('contractIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'code',
      title: t('contractCodeHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'contractorId',
      title: t('contractQuoteContractorHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'projectId',
      title: t('contractQuoteProjectHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: '',
      title: t('contractAddressHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('contractDetailHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'status',
      title: t('contractStatusHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('contractCreatedAtHeadCell'),
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

  const handleOpenDetail = (contract?: ContractType) => {
    setOpenModalDetail(!openModalDetail)
    setContractActive(contract)
  }

  useEffect(() => {
    getContractApi()
    const channel = initChannel()
    channel.bind(`contract.update`, function () {
      getContractApi()
    })
  }, [params])

  useEffect(() => {
    getAllProjectOptionsApi()
    getAllContractorOptionsApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} spacing={2} width="100%">
      <SearchField />
      <Filter />
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {contractList?.length > 0 &&
          contractList.map((item: ContractType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.code} />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item.quote.contractor?.name}
                />
              </TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item.quote.project?.name}
                />
              </TableCell>
              <TableCell>
                {item.quote.district?.title}, {item.quote.province?.title}
              </TableCell>

              <TableCell>
                <ProductItem item={item?.quote?.items} />
              </TableCell>
              <TableCell>
                <StatusProgress status={item.status} />
              </TableCell>
              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('contracts_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('contracts_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setContractActive(item)
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
      </MainDataTable>

      {openModalDetail && <ModalDetail />}
      {openModalDelete && <ModalDelete />}
    </>
  )
}
