import { createFileRoute } from '@tanstack/react-router'
import Slots from '@/pages/Slots'

export const Route = createFileRoute('/(app)/slots/')({
  component: Slots,
})
