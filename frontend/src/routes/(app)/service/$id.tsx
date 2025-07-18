import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/service/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/service/$id"!</div>
}
