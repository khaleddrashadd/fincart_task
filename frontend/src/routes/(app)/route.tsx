import { createFileRoute } from '@tanstack/react-router'
import MainLayout from '@/layouts/MainLayout'

export const Route = createFileRoute('/(app)')({
  component: MainLayout,
})
