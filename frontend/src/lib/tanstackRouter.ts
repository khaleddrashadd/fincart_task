import { createRouter } from '@tanstack/react-router'
import * as TanStackQueryProvider from '../integrations/tanstack-query/root-provider.tsx'
import { routeTree } from '@/routeTree.gen.ts'

export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})
