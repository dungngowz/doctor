import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import {
  calcIndexDataTable,
  formatDate,
  isPermissionCreate,
  isPermissionDelete,
  isPermissionUpdate,
  t,
} from '@/utils'
import { Visibility } from '@mui/icons-material'
import { IconButton, Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getProductInputApi } from '../api'
import { productInputActiveState, productInputListState } from '../store'
import { ProductInputType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ProductInputContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const productInputList = useRecoilValue<ProductInputType[]>(productInputListState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setProductInputActive = useSetRecoilState<ProductInputType | any>(productInputActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('productInputIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'vehicleId',
      title: t('productInputVehicleHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: '',
      title: t('productInputProductCateHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: '',
      title: t('productInputFirstWeightHeadCell'),
      disableSort: true,
      numeric: false,
    },
    {
      id: '',
      title: t('productInputSecondaryWeightHeadCell'),
      disableSort: true,
      numeric: false,
    },

    {
      id: 'createdAt',
      title: t('productInputCreateAtHeadCell'),
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

  const handleOpenDetail = (product?: ProductInputType) => {
    setOpenModalDetail(!openModalDetail)
    setProductInputActive(product)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const getApiData = async () => {
      await getProductInputApi(params)
    }
    getApiData()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        {/* <Filter /> */}
      </Stack>

      {isPermissionCreate('product_input_create') && (
        <ButtonAddNew
          btnText={t('productInputBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setProductInputActive(null)
          }}
        />
      )}
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {productInputList?.length > 0 &&
          productInputList.map((item: ProductInputType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.vehicle?.code} />
              </TableCell>

              <TableCell>{item?.product?.productCategory?.title}</TableCell>
              <TableCell>{item?.firstWeightFormatted}</TableCell>
              <TableCell>{item?.secondaryWeightFormatted}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('product_input_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('product_input_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setProductInputActive(item)
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
