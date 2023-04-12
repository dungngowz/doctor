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
import { calcIndexDataTable, formatDate, t } from '@/utils'
import { Stack, TableCell, TableRow } from '@mui/material'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { getBaseApi } from '../api'
import { baseActiveState, baseListState } from '../store'
import { BaseType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const BaseContainer = () => {
  // Recoil
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const params = useRecoilValue(dataTableParamsState)
  const baseList = useRecoilValue<BaseType[]>(baseListState)
  const setBaseListActive = useSetRecoilState<BaseType | any>(baseActiveState)

  const headCells: HeadCellsType[] = [
    {
      id: 'id',
      title: t('baseIdHeadCell'),
      disableSort: false,
      numeric: false,
      width: 50,
    },
    {
      id: 'createdAt',
      title: t('baseCreatedAtHeadCell'),
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

  const handleOpenDetail = (base?: BaseType) => {
    setOpenModalDetail(!openModalDetail)
    setBaseListActive(base)
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    getBaseApi()
  }, [params])

  const HeadTable = (
    <Stack direction={'row'} justifyContent="space-between">
      <Stack direction={'row'} spacing={2} width="100%">
        <SearchField />
        <Filter />
      </Stack>

      <ButtonAddNew
        btnText={t('baseBtnAddNew')}
        handleClick={() => {
          setOpenModalDetail(!openModalDetail)
          setBaseListActive(null)
        }}
      />
    </Stack>
  )

  return (
    <>
      <MainDataTable
        headCells={headCells}
        maxHeight={'calc(100vh - 230px)'}
        actionHeadProps={HeadTable}
      >
        {baseList?.length > 0 &&
          baseList.map((item: BaseType, index: number) => (
            <TableRow tabIndex={-1} key={item.id} onClick={() => handleOpenDetail(item)}>
              <TableCell>{calcIndexDataTable(index)}</TableCell>
              {/* <TableCell>
                <Highlighter
                  searchWords={[params.keyword]}
                  textToHighlight={item.quote.baseor?.name}
                />
              </TableCell> */}

              <TableCell>{formatDate(item.createdAt, 'DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Stack direction={'row'} spacing={1}>
                  <IconButtonEdit />

                  <IconButtonDelete
                    handleClick={(e) => {
                      e.stopPropagation()
                      setOpenModalDelete(!openModalDelete)
                      setBaseListActive(item)
                    }}
                  />
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
