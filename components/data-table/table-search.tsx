import { Close } from '@mui/icons-material'
import { Box, IconButton, InputBase, Stack } from '@mui/material'
import { useState } from 'react'

type ITableSearchProps = {
  onChange: (e: string) => void
  onClick?: () => void
}
export const TableSearch = (props: ITableSearchProps) => {
  const { onChange } = props

  const [searchValues, setSearchValues] = useState('')

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
    setSearchValues(event.target.value)
  }

  /**
   * It takes the value of the input field and sets it to an empty string
   */
  const handleClearValue = () => {
    onChange('')
    setSearchValues('')
  }
  return (
    <Stack>
      <Box className="table-search-wrapper" width={'100%'}>
        <i className="ic ic--search"></i>
        <InputBase
          placeholder="Search..."
          onChange={handleOnChange}
          value={searchValues}
          inputProps={{ 'aria-label': 'search' }}
          fullWidth
        />
        {searchValues && (
          <IconButton size="small" edge="end" onClick={handleClearValue}>
            <Close />
          </IconButton>
        )}
      </Box>
    </Stack>
  )
}
