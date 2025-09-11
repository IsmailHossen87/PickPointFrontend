import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteTourTypeMutation } from "@/redux/feature/Tour/tour.api"
import type { ReactNode } from "react"
import { toast } from "sonner"

interface IProps {
    children: ReactNode,
    id: string
}

export function DeleteConfirmation({ children, id }: IProps) {
    const [deleteTourType] = useDeleteTourTypeMutation()
// ai kaj ta ekhane na kore jekhan theke id astese sekhanew kora jai
    const handleConfirm = async () => {
        const toastId = toast.loading("Removing.......")
        const res = await deleteTourType(id).unwrap()
        if(res.success){
            toast.success("Removed",{id:toastId})
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {/* <Button ><Trash2/></Button> */}
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}  >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
