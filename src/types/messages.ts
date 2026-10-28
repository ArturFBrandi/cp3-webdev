export interface Message {
  id: string
  name: string
  email: string
  message: string
  answered: boolean
  answeredAt: string | null
  createdAt: string
}
