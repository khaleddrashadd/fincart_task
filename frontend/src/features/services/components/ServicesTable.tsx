import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { servicesService } from '../services/servicesService'
import { Button } from '@/components/ui/button'
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
  return (
    <>
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
              <TableCell className="text-center">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
export default ServicesTable
