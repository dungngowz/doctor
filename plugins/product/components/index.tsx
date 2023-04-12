import {
  ButtonAddNew,
  IconButtonDelete,
  IconButtonEdit,
  MainDataTable,
  ProductTypeStatus,
  SearchField,
} from '@/components'
import { HeadCellsType } from '@/components/data-table/type'
import { getAllProductCategoryApi } from '@/meta/common'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableParamsState } from '@/store/param-data'
import { permissionsRuleState } from '@/store/user'
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
import { getProductDataApi } from '../api'
import { productActiveState, productListState } from '../store'
import { ProductType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ProductContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const productList = useRecoilValue<ProductType[]>(productListState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setProductActive = useSetRecoilState<ProductType | any>(productActiveState)
  const permissionsRule = useRecoilValue(permissionsRuleState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('productIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'productCategoryId',
      title: t('productCategoryTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'code',
      title: t('productCodeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'title',
      title: t('productTitleHeadCell'),
      disableSort: false,
      numeric: false,
    },

    {
      id: 'type',
      title: t('productTypeHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'createdAt',
      title: t('productCreateAtHeadCell'),
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

  const handleOpenDetail = (product?: ProductType) => {
    if (permissionsRule.includes('products_view')) {
      setOpenModalDetail(!openModalDetail)
      setProductActive(product)
    } else {
      return
    }
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    const getApiData = async () => {
      await getProductDataApi(params)
    }
    getApiData()
  }, [params])

  /* Calling the getAllProductCategoryApi() function every time the component is mounted. */
  useEffect(() => {
    getAllProductCategoryApi()
  }, [])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {/* Check role all created  */}
      {isPermissionCreate('products_create') ? (
        <ButtonAddNew
          btnText={t('productBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setProductActive(null)
          }}
        />
      ) : null}
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {productList?.length > 0 &&
          productList.map((item: ProductType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item?.productCategory.title}
                />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.code} />
              </TableCell>

              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.title} />
              </TableCell>
              <TableCell>
                <ProductTypeStatus type={item.type} />
              </TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1}>
                  {isPermissionUpdate('products_view') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('products_delete') ? (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setProductActive(item)
                      }}
                    />
                  ) : null}
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
