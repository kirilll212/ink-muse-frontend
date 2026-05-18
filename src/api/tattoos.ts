import { apiClient } from './client'
import type { GenerateTattooInput, SuggestPromptInput, Tattoo } from '../types'

/**
 * Tattoo API calls.
 */
export const tattoosApi = {
  async generate(input: GenerateTattooInput): Promise<Tattoo> {
    const { data } = await apiClient.post<Tattoo>('/tattoos/generate', input)
    return data
  },

  async suggestPrompt(input: SuggestPromptInput): Promise<string> {
    const { data } = await apiClient.post<{ description: string }>(
      '/tattoos/suggest-prompt',
      input
    )
    return data.description
  },

  async edit(id: number, description: string): Promise<Tattoo> {
    const { data } = await apiClient.post<Tattoo>(`/tattoos/${id}/edit`, { description })
    return data
  },

  async list(): Promise<Tattoo[]> {
    const { data } = await apiClient.get<Tattoo[]>('/tattoos')
    return data
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/tattoos/${id}`)
  },
}
