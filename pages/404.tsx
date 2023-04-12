import { brand } from '@/components/colors/brand'
import { EmptyLayout } from '@/layouts'
import { Box, Button, Card, Container, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

export default function Custom404Page() {
  return (
    <Container maxWidth={'sm'} sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card elevation={0} sx={{ width: '100%', p: 2, py: 6 }}>
        <Typography textAlign={'center'} fontSize={'36px'} fontWeight={600}>
          Oops!
        </Typography>
        <Typography textAlign={'center'} fontWeight={500} color={brand.gray500}>
          Trang không được tìm thấy
        </Typography>

        <Image src={'/images/404-error.png'} layout="responsive" width={'100%'} height={'100%'} />
        <Box display={'flex'} justifyContent={'center'}>
          <Link href="/">
            <Button variant="contained">Trở về trang chủ</Button>
          </Link>
        </Box>
      </Card>
    </Container>
  )
}

Custom404Page.Layout = EmptyLayout
