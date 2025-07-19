import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/slots/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/slots/"!</div>
}
