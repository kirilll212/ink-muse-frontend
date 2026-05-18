import { apiClient } from './client'
import type { AuthResponse, RegisterInput, User } from '../types'

/**
 * Auth API calls.
 */
export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', input)
    return data
  },

  async login(input: { email: string; password: string }): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', input)
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async forgotPassword(
    email: string
  ): Promise<{ email: string; code: string; expiresInMinutes: number }> {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(input: {
    email: string
    code: string
    password: string
  }): Promise<void> {
    await apiClient.post('/auth/reset-password', input)
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<{ user: User }>('/auth/me')
    return data.user
  },
}
