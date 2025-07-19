import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { servicesService } from '../services/servicesService'
import AddServiceDialog from '../components/AddServiceDialog'
import { editServiceService } from '../services/editServiceService'
import { deleteServiceService } from '../services/deleteServiceService'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ServicesTable = () => {
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: servicesService,
    placeholderData: keepPreviousData,
  })
  const navigate = useNavigate()
  const [editService, setEditService] = useState<any>(null)
  const [deleteService, setDeleteService] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: deleteServiceService,
    onSuccess: () => {
      setEditService(null)
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
  return (
    <>
      {/* Edit Service Dialog */}
      {editService && (
        <AddServiceDialog
          mutationFn={editServiceService}
          open={!!editService}
          setOpen={setEditService}
          defaultData={editService}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deleteService?.title}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                mutate(deleteService.id)
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
            <TableHead className="w-3/12">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>price</TableHead>
            <TableHead>duration</TableHead>
            <TableHead>by</TableHead>
            <TableHead className="w-2/12 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicesData?.services.map((service, idx: number) => (
            <TableRow key={service.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{service.title}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>{service.price}</TableCell>
              <TableCell>{service.duration}</TableCell>
              <TableCell>
                {service.provider.firstName + ' ' + service.provider.lastName}
              </TableCell>
              <TableCell className="text-center flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: `/service/${service.id}`,
                    })
                  }
                >
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setEditService({ ...service, id: service.id })}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    setDeleteService(service)
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
export default ServicesTable
