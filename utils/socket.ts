import Pusher from 'pusher-js'

export const initChannel = () => {
  const pusher = new Pusher(process.env.PUSHER_APP_KEY as any as string, {
    cluster: process.env.PUSHER_APP_CLUSTER ?? 'ap1',
  })
  return pusher.subscribe('channel')
}
