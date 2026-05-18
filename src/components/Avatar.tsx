import { resolveImageUrl } from '../api/client'

interface AvatarUser {
  firstName: string
  lastName: string
  username: string
  avatarUrl: string | null
}

/** Palette used for the generated initials avatars. */
const PALETTE = [
  '#7c3aed',
  '#db2777',
  '#0891b2',
  '#16a34a',
  '#ea580c',
  '#4f46e5',
  '#c026d3',
  '#0d9488',
]

/** Pick a stable colour for a user from their username. */
function colorFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return PALETTE[hash % PALETTE.length]
}

function initials(user: AvatarUser): string {
  const value = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  return value || user.username.charAt(0).toUpperCase() || '?'
}

/**
 * Round user avatar — shows the uploaded image, or a coloured circle with the
 * user's initials when no avatar has been set.
 */
export function Avatar({ user, size = 40 }: { user: AvatarUser; size?: number }) {
  if (user.avatarUrl) {
    return (
      <img
        src={resolveImageUrl(user.avatarUrl)}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      aria-hidden
      className="flex items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: colorFor(user.username || user.firstName),
        fontSize: Math.round(size * 0.4),
      }}
    >
      {initials(user)}
    </div>
  )
}
