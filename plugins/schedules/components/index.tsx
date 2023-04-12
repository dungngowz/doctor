import { ButtonAddNew, ButtonEdit, ItemRow, SchedulesLoading, SearchField } from '@/components'
import { brand } from '@/components/colors/brand'
import { getAllProductOptionsApi, getAllSuppliersOptionsApi } from '@/meta/common'
import { openModalDeleteState, openModalDetailState } from '@/store/common'
import { dataTableFirstLoadingState } from '@/store/param-data'
import { formatDate, t } from '@/utils'
import { Ballot, Delete } from '@mui/icons-material'
import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { getSchedulesApi } from '../api'
import {
  dataTableSchedulesParamsState,
  isSchedulesEndReachingState,
  schedulesActiveState,
  schedulesListState,
} from '../store'
import { ScheduleType } from '../type'
import { Filter } from './filter'
import { ModalDelete } from './modal-delete'
import { ModalDetail } from './modal-detail'

export const SchedulesContainer = () => {
  // Recoil
  const params = useRecoilValue(dataTableSchedulesParamsState)
  const schedulesList = useRecoilValue(schedulesListState)
  const isFirstLoading = useRecoilValue(dataTableFirstLoadingState)
  const isScheduleEndReaching = useRecoilValue(isSchedulesEndReachingState)
  const [openModalDetail, setOpenModalDetail] = useRecoilState(openModalDetailState)
  const [openModalDelete, setOpenModalDelete] = useRecoilState(openModalDeleteState)

  // Hooks
  const router = useRouter()

  // State
  const [isBottom, setIsBottom] = useState(false)

  // Handle fetch more data
  const handleFetchMoreData = () => {
    if (isScheduleEndReaching) {
      setIsBottom(false)
      return
    } else {
      setIsBottom(true)
      setRecoil(dataTableSchedulesParamsState, (prevState) => {
        return {
          ...prevState,
          page: prevState.page + 1,
        }
      })
    }
  }

  const handleOpenDetail = (schedule?: ScheduleType) => {
    setOpenModalDetail(!openModalDetail)
    setRecoil(schedulesActiveState, schedule ?? null)
  }

  // Watch schedule api
  useEffect(() => {
    getSchedulesApi()
  }, [params])

  // Event listen scroll
  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      const { pageYOffset, innerHeight } = window
      if (innerHeight + pageYOffset >= document.body.offsetHeight) {
        handleFetchMoreData()
      }
    })
  }, [])

  // Get Options
  useEffect(() => {
    getAllSuppliersOptionsApi()
    getAllProductOptionsApi()
  }, [])

  return (
    <Box>
      <Stack direction={'row'} mb={2} justifyContent="space-between">
        <Stack direction={'row'} spacing={2}>
          <SearchField />
          <Filter />
        </Stack>

        <ButtonAddNew
          handleClick={() => {
            setRecoil(schedulesActiveState, null)
            setOpenModalDetail(true)
          }}
          btnText={t('schedulesBtnAddNew')}
        />
      </Stack>

      <Grid container spacing={4} className="schedules-container">
        {isFirstLoading ? (
          <SchedulesLoading />
        ) : (
          <>
            {schedulesList?.length > 0 ? (
              schedulesList.map((item, index: number) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  xl={4}
                  onClick={() => handleOpenDetail(item)}
                >
                  <Card className="schedules-item">
                    <Stack spacing={2} pb={2}>
                      <Stack direction={'row'}>
                        <ItemRow
                          title={t('schedulesOrderCodeLabel')}
                          description={item?.orderCode}
                        />
                        <ItemRow
                          title={t('schedulesContractorNameLabel')}
                          description={item.supplier.name}
                        />
                      </Stack>
                      <Stack direction={'row'}>
                        <ItemRow
                          title={t('schedulesOrderVolumeLabel')}
                          description={item.orderVolumeFormatted}
                        />
                        <ItemRow
                          title={t('schedulesExportedVolumeLabel')}
                          description={item?.exportedVolumeFormatted}
                        />
                      </Stack>

                      <Stack direction={'row'}>
                        <ItemRow
                          title={t('schedulesRemainingMassLabel')}
                          description={item.remainingMassFormatted}
                        />
                        <ItemRow
                          title={t('schedulesTimeExportLabel')}
                          description={formatDate(item.timeExport, 'DD/MM/YYYY')}
                        />
                      </Stack>
                      <Stack direction={'row'}>
                        <ItemRow
                          title={t('schedulesSelectProductLabel')}
                          description={item.product.title}
                        />
                        <ItemRow
                          title={t('schedulesShippingUnitLabel')}
                          description={item.shippingUnit}
                        />
                      </Stack>
                    </Stack>

                    <Divider />
                    <Stack direction={'row'} spacing={2} pt={2} justifyContent="center">
                      <ButtonEdit
                        disabled={item?.disableEditDelete}
                        btnText={t('schedulesBtnEdit')}
                        size="small"
                      />
                      <Button
                        startIcon={<Ballot />}
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push({
                            pathname: '/schedules/product-deliveries/' + item.id.toString(),
                          })
                        }}
                      >
                        {t('schedulesBtnListExporting')}
                      </Button>
                      <Button
                        startIcon={<Delete />}
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenModalDelete(!openModalDelete)
                          setRecoil(schedulesActiveState, item)
                        }}
                        disabled={item?.disableEditDelete}
                      >
                        {t('schedulesBtnDelete')}
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  fontSize={'13px'}
                  pt={10}
                  color={brand.gray600}
                  fontStyle="italic"
                  textAlign={'center'}
                >
                  {t('schedulesNotFoundData')}
                </Typography>
              </Grid>
            )}
            {isBottom ? (
              <>
                {isScheduleEndReaching ? (
                  ''
                ) : (
                  <Grid container spacing={2} pt={2}>
                    <SchedulesLoading />
                  </Grid>
                )}
              </>
            ) : null}
          </>
        )}
      </Grid>

      {openModalDetail && <ModalDetail />}
      {openModalDelete && <ModalDelete />}
    </Box>
  )
}
