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
import { getProvinceDataApi } from '../api'
import { provinceActiveState, provinceListState } from '../store'
import { ProvinceType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const ProvinceContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const provinceList = useRecoilValue<ProvinceType[]>(provinceListState)
  const setProvinceActive = useSetRecoilState<ProvinceType | any>(provinceActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('provinceIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'regionId',
      title: t('provinceNameRegionHeadCell'),
      disableSort: false,
      numeric: false,
      width: '30%',
    },
    {
      id: 'title',
      title: t('provinceNameHeadCell'),
      disableSort: false,
      numeric: false,
      width: '30%',
    },

    {
      id: 'createdAt',
      title: t('provinceDateHeadCell'),
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

  const handleOpenDetail = (region?: ProvinceType) => {
    setOpenModalDetail(!openModalDetail)
    setProvinceActive(region)
  }

  useEffect(() => {
    getProvinceDataApi(params)
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      {isPermissionCreate('provinces_create') && (
        <ButtonAddNew
          btnText={t('provinceBtnAddNew')}
          handleClick={() => {
            setOpenModalDetail(!openModalDetail)
            setProvinceActive(null)
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
        {provinceList?.length > 0 &&
          provinceList.map((item: ProvinceType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.region?.title} />
              </TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.title} />
              </TableCell>

              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1}>
                  {isPermissionUpdate('provinces_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('provinces_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setProvinceActive(item)
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
