import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type AddServiceDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  defaultData?: {
    title: string
    price: string
    duration: string
    description: string
    id?: number
  }
  mutationFn: (data: any) => Promise<any>
}

const AddServiceDialog = ({
  open,
  setOpen,
  defaultData,
  mutationFn,
}: AddServiceDialogProps) => {
  const [form, setForm] = useState({
    title: defaultData?.title || '',
    price: defaultData?.price || '',
    duration: defaultData?.duration || '',
    description: defaultData?.description || '',
    id: defaultData?.id || null,
  })
  const queryClient = useQueryClient()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const { isPending, mutate, error } = useMutation({
    mutationFn,
    onSuccess: () => {
      setOpen(false)
      setForm({ title: '', price: '', duration: '', description: '', id: null })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  const handleSubmit = () => mutate(form)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent>
          <>
            <DialogTitle>Add Service</DialogTitle>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="mb-3" htmlFor="title">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="mb-3" htmlFor="price">
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <Label className="mb-3" htmlFor="duration">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  type="number"
                  min="1"
                />
              </div>
              <div>
                <Label className="mb-3" htmlFor="description">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[80px] rounded-md border px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error.message}</div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {defaultData ? 'Edit Service' : 'Add Service'}
            </Button>
          </>
        </DialogContent>
      </form>
    </Dialog>
  )
}
export default AddServiceDialog
