import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { useAddDivisionMutation } from "@/redux/feature/Division/division.api";
import { useState } from "react";

import { useFieldArray, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
// import { toast } from "sonner";

export default function AddDivisionModal() {

    const [division] = useAddDivisionMutation(undefined)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<(File | FileMetadata) | null>(null) //To link

    const form = useForm({
        defaultValues: {
            country: "USA",
            name: "Washington",
            description: "",
        }
    })



    const onsubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("data", JSON.stringify(data));
            formData.append("file", image as File)

            const res = await division(formData).unwrap()
            console.log(res)
            if (res.success) {
                toast.success("Division Created Successfully")
                form.reset()
                setOpen(false)

            }
        } catch (err) {
            toast.error("Division create fail", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Division</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Division</DialogTitle>
                </DialogHeader>

                {/* ✅ FormProvider diye wrap kore ekdom ekta form use koro */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Country"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Division Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tour Type Name"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type your message here."
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* image */}
                        <SingleImageUploader onChange={setImage} />
                       
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={() => setOpen(true)} type="submit" disabled={loading}>
                                {loading && (
                                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                                )} {loading ? "Saving" : "Save Changes"
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
