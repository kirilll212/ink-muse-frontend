import { apiClient } from './client'
import type { ProfileInput, User } from '../types'

/**
 * Profile API calls.
 */
export const profileApi = {
  /**
   * Update the current user's profile fields.
   */
  async update(input: ProfileInput): Promise<User> {
    const { data } = await apiClient.patch<{ user: User }>('/profile', input)
    return data.user
  },

  /**
   * Upload a new avatar image (multipart) and return the updated user.
   */
  async uploadAvatar(file: File): Promise<User> {
    const form = new FormData()
    form.append('avatar', file)
    const { data } = await apiClient.post<{ user: User }>('/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.user
  },
}
