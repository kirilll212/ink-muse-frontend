/**
 * Download an image to the user's device.
 *
 * The backend serves images from a different origin, so a plain
 * `<a download>` would not force a download — instead the bytes are fetched
 * and saved through an object URL.
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  const response = await fetch(url)
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(objectUrl)
}
