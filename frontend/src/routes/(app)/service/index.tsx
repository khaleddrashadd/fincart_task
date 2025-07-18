import { createFileRoute } from '@tanstack/react-router'
import Service from '@/pages/Service'

export const Route = createFileRoute('/(app)/service/')({
  component: Service,
})
