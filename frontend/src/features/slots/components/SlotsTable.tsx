import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { slotsService } from '../services/slotsService'
import AddSlotDialog from './AddSlotDialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const SlotsTable = () => {
  const { data: slotsData } = useQuery({
    queryKey: ['slots'],
    queryFn: slotsService,
    placeholderData: keepPreviousData,
  })
  const navigate = useNavigate()
  const [editSlot, setEditSlot] = useState(null)
  const [deleteSlot, setDeleteSlot] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      {/* Edit Slot Dialog */}
      {editSlot && (
        <AddSlotDialog
          open={!!editSlot}
          onOpenChange={() => setEditSlot(null)}
          defaultData={editSlot}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Slot</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this slot?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: implement delete logic here
                setIsDeleteDialogOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">#</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Booked</TableHead>
            <TableHead>Service</TableHead>
            <TableHead className="w-2/12 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slotsData?.slots.map((slot, idx) => (
            <TableRow key={slot.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{new Date(slot.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(slot.endTime).toLocaleString()}</TableCell>
              <TableCell>{slot.isBooked ? 'Yes' : 'No'}</TableCell>
              <TableCell>{slot.service?.title || ''}</TableCell>
              <TableCell className="text-center flex gap-2 justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setEditSlot(slot)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    setDeleteSlot(slot)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
export default SlotsTable
