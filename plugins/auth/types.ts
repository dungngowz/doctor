export type FormLoginType = {
  email: string
  password: string
  remember: boolean
  role: 'admin' | 'company' | 'member'
}
