import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ServicesTable from '@/features/services/components/ServicesTable'
import { useCredential } from '@/store/useCredential'
import { authorize } from '@/utils/authorize'
import AddServiceDialog from '@/features/services/components/AddServiceDialog'
import { addService } from '@/features/services/services/addServiceService'
import SlotsTable from '@/features/slots/components/SlotsTable'

const Slots = () => {
  const { role } = useCredential()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-green-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Services</CardTitle>
          {authorize(role, 'create', 'services') && (
            <Button className="cursor-pointer" onClick={() => setOpen(true)}>
              Add Slot
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <SlotsTable />
        </CardContent>
      </Card>

      <AddServiceDialog open={open} setOpen={setOpen} mutationFn={addService} />
    </div>
  )
}

export default Slots
