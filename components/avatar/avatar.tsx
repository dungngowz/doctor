import { Box } from '@mui/material'
import Image from 'next/image'

/**
 * IAvatarProps is an object with three optional properties: avatarUrl, height, and width.
 * @property {string} avatarUrl - The URL of the avatar image.
 * @property {number} height - The height of the avatar.
 * @property {number} width - The width of the avatar.
 */
type IAvatarProps = {
  avatarUrl?: string
  height?: number
  width?: number
}

export const Avatar = (props: IAvatarProps) => {
  /* Destructuring the props object and assigning default values to the properties. */
  const { avatarUrl = '/images/businessman.webp', height = 32, width = 32 } = props
  return (
    <Box position={'relative'} height={height} width={width} className="avatar-wrapper">
      <Image src={avatarUrl} layout="fill" objectFit="cover" alt="" />
    </Box>
  )
}
