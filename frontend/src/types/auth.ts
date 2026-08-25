export interface UserSummary {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: UserSummary
}
