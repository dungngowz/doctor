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
import { getRegionData } from '../api'
import { regionActiveState, regionListState } from '../store'
import { RegionListType } from '../type'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const RegionContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableParamsState)
  const regionList = useRecoilValue<RegionListType[]>(regionListState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const setRegionActive = useSetRecoilState<RegionListType | any>(regionActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('regionIdHeadCell'),
      disableSort: false,
      numeric: false,
    },
    {
      id: 'title',
      title: t('regionNameHeadCell'),
      disableSort: false,
      numeric: false,
      width: '60%',
    },
    {
      id: 'createdAt',
      title: t('regionDateHeadCell'),
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

  const handleOpenDetail = (region?: RegionListType) => {
    setOpenModalDetail(!openModalDetail)
    setRegionActive(region)
  }

  /* It's a hook that will run when the component is mounted and when the params change. */
  useEffect(() => {
    const getApiData = async () => {
      await getRegionData()
    }
    getApiData()
  }, [params])

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={
          <Stack direction={'row'} justifyContent="space-between">
            <SearchField />

            {isPermissionCreate('regions_create') && (
              <ButtonAddNew
                btnText={t('regionBtnAddNew')}
                handleClick={() => {
                  setOpenModalDetail(!openModalDetail)
                  setRegionActive(null)
                }}
              />
            )}
          </Stack>
        }
      >
        {regionList?.length > 0 &&
          regionList.map((item, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              <TableCell>
                <Highlighter searchWords={[params.keyword]} textToHighlight={item?.title} />
              </TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
                  {isPermissionUpdate('regions_update') ? (
                    <IconButtonEdit />
                  ) : (
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  )}

                  {isPermissionDelete('regions_delete') && (
                    <IconButtonDelete
                      handleClick={(e) => {
                        e.stopPropagation()
                        setOpenModalDelete(!openModalDelete)
                        setRegionActive(item)
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
