import { ButtonBase, ButtonSubmit, MainModal, ModalAction } from '@/components'
import { Stack, Typography } from '@mui/material'

import Image from 'next/image'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useRecoilState } from 'recoil'
import { openQrcodeState, vehicleActiveState } from '../store'
import { VehicleType } from '../type'

export const ModalQrCode = () => {
  // Recoil
  const [openQrcode, setOpenQrcode] = useRecoilState(openQrcodeState)
  const [vehicleActive, setVehicleActive] = useRecoilState<VehicleType | null>(vehicleActiveState)

  // Handle close modal
  const handleClose = () => {
    setOpenQrcode(!openQrcode)
    setVehicleActive(null)
  }

  const componentRef = useRef<HTMLImageElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  return (
    <MainModal open={openQrcode} onClose={handleClose} title={''}>
      <Stack pb={9}>
        {vehicleActive && (
          <div ref={componentRef}>
            <Image src={vehicleActive?.qrcode} layout="responsive" width={'100%'} height="100%" />

            <Typography py={3} textAlign="center" fontSize={'30px'}>
              Biển số xe: <strong> {vehicleActive?.code}</strong>
            </Typography>
          </div>
        )}
      </Stack>

      <ModalAction>
        <ButtonBase handleClick={handleClose} btnText="Đóng" />
        <ButtonSubmit btnText="In QrCode" handleClick={handlePrint} />
      </ModalAction>
    </MainModal>
  )
}
