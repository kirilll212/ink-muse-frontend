import { apiClient } from './client'
import type { AuthResponse, User } from '../types'

/**
 * Auth API calls.
 */
export const authApi = {
  async register(input: {
    fullName: string
    email: string
    password: string
  }): Promise<AuthResponse> {
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

  async me(): Promise<User> {
    const { data } = await apiClient.get<{ user: User }>('/auth/me')
    return data.user
  },
}
