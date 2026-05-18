import { Spinner } from './Spinner'

/**
 * Centered full-height loading indicator, used while async state resolves.
 */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-brand-500">
      <Spinner className="h-8 w-8" />
    </div>
  )
}
