import { ButtonBase, ButtonSubmit } from '@/components'
import { formatDate } from '@/utils'
import { Close, DateRangeOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  Stack,
} from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import { vi } from 'date-fns/locale'
import React, { useState } from 'react'
import { DateRange, RangeKeyDict } from 'react-date-range'

type IProps = {
  onHandleSubmit: (dateRange: any) => void
  handleClear: () => void
}

export const DateRangePickerBase = (props: IProps) => {
  // Props
  const { onHandleSubmit, handleClear } = props

  // Date state
  const [dateRange, setDateState] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  const [dateValue, setDateValue] = useState('')

  // State menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleChangeDate = (item: RangeKeyDict) => {
    setDateState([item.selection])
  }

  // Handle submit date
  const handleSubmitDateFilter = () => {
    handleCloseMenu()
    const startDate = formatDate(dateRange[0].startDate, 'DD-MM-YYYY')
    const endDate = formatDate(dateRange[0].endDate, 'DD-MM-YYYY')

    onHandleSubmit({
      startDate: startDate,
      endDate: endDate,
    })

    setDateValue('Từ ' + startDate + ' đến ' + endDate)
  }

  // On clear date
  const handleClearDate = () => {
    setDateState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ])
    setDateValue('')
    handleClear()
  }

  return (
    <>
      <FormControl sx={{ width: 300, position: 'relative' }} className="date-range-picker-wrapper">
        <OutlinedInput
          id="input-date"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          readOnly
          value={dateValue}
          size="small"
          placeholder="Lọc theo ngày"
          endAdornment={
            <InputAdornment position="end">
              <IconButton size="small" edge="end" sx={{ mr: '-10px' }}>
                <DateRangeOutlined />
              </IconButton>
            </InputAdornment>
          }
        />

        <Fade in={dateValue ? true : false} onClick={handleClearDate}>
          <Box position={'absolute'} right={32} top={2.8}>
            <IconButton size="small">
              <Close />
            </IconButton>
          </Box>
        </Fade>
      </FormControl>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          className: 'date-range-picker-menu',
        }}
      >
        <Stack>
          <DateRange
            editableDateInputs={true}
            onChange={handleChangeDate}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            locale={vi}
          />

          <Divider />
          <Stack direction={'row'} spacing={1} justifyContent="flex-end" pr={2} pt={1}>
            <ButtonBase btnText="Đóng" size="small" handleClick={handleCloseMenu} />
            {dateValue && (
              <Button size="small" color="error" variant="contained" onClick={handleClearDate}>
                Xoá
              </Button>
            )}
            <ButtonSubmit
              btnText="Xác nhận"
              size="small"
              disabled={dateRange[0].endDate == null ? true : false}
              handleClick={handleSubmitDateFilter}
            />
          </Stack>
        </Stack>
      </Menu>
    </>
  )
}
