import { useGetTourTypeQuery } from "@/redux/feature/Tour/tour.api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddTourModal from "@/module/admin/TourType/AddTourModal"
import { DeleteConfirmation } from "@/components/DeleteConfirmation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddTourType() {
  const { data } = useGetTourTypeQuery(undefined)

  return (
    <div className="max-w-7xl mx-auto w-full"> 
    <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
          Manage Tour Types
        </h1>
        <AddTourModal/>
      </div>
      <div className="border border-muted rounded-md">
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">No</TableHead>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item: { _id: string; name: string; createdAt: string },index:number) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{index+1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {/* <Button size="sm" className=" hover:underline "><Trash2/></Button> */}
                  <DeleteConfirmation id={item._id}><Button ><Trash2/></Button></DeleteConfirmation>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
