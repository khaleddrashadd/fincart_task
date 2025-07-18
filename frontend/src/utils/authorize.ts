const roles = {
  provider: [
    'view:services',
    'create:services',
    'update:services',
    'delete:services',
    'create:slot',
    'delete:slot',
    'update:slot',
    'view:slot',
    'view:bookings',
  ],
  user: ['view:services', 'view:slot', 'create:booking', 'view:booking'],
}

type Role = keyof typeof roles
type Action = 'view' | 'create' | 'update' | 'delete'
type Resource = 'services' | 'slot' | 'bookings'

export const authorize = (
  role?: Role,
  action?: Action,
  resource?: Resource,
  excludedRoles: Array<Role> = [],
) => {
  if (!role || !resource || !action) return false

  const includedRoles = Object.fromEntries(
    Object.entries(roles).filter(
      ([key]) => !excludedRoles.includes(key as Role),
    ),
  )

  if (includedRoles[role.toLowerCase()].includes(`${action}:${resource}`)) {
    return true
  }
  return false
}
