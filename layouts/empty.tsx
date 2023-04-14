import { LayoutProps } from '@/types'
import { Container } from '@mui/system'

export const EmptyLayout = ({ children }: LayoutProps) => {
  return <Container>{children}</Container>
}
