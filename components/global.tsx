import { useRecoilValue } from 'recoil'
import { Loading } from './loading'
import { loadingState } from './loading/store'

/**
 * It returns a Loading component that is open if the loadingState is true
 * @returns A loading component that is either open or closed.
 */
export const GlobalComponent = () => {
  const loading = useRecoilValue(loadingState)

  return <Loading open={loading} />
}
