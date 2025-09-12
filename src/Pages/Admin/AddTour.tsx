import MultipleImageUpload from "@/components/multipleImageUpload";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useDivisionDataQuery } from "@/redux/feature/Division/division.api";
import { useAddTourMutation, useGetTourTypeQuery } from "@/redux/feature/Tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover } from "@radix-ui/react-popover";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useFieldArray, useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import z from "zod";
// schema for show error
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  costFrom: z.string().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.string().min(1, "Max guest is required"),
  minAge: z.string().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export function AddTour() {
  const [images, setImage] = useState<(File | FileMetadata)[] | []>([])
  const [addTour] = useAddTourMutation()
  const [loading, setLoading] = useState(false)


  const { data: divisionData, isLoading: divisionLoading } = useDivisionDataQuery({limit:1000})
  const { data: tourTypeData, isLoading: tourLoading } = useGetTourTypeQuery({limit:1000})

  const divisionOptions = divisionData?.data?.map(
    (item: { _id: string; name: string, country: string }) => ({
      value: item._id,
      label: item.name,
      country: item.country,
    })
  );

  const tourTypeOptions = tourTypeData?.data?.map(
    (tourType: { _id: string; name: string }) => ({
      value: tourType._id,
      label: tourType.name,
    })
  );


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Cox's Bazar Beach Adventure",
      description:
        "Experience the world's longest natural sea beach with golden sandy shores, crystal clear waters, and breathtaking sunsets. Enjoy beach activities, local seafood, and explore nearby attractions including Himchari National Park and Inani Beach.",
      location: "Cox's Bazar",
      costFrom: "15000",
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      departureLocation: "Dhaka",
      arrivalLocation: "Cox's Bazar",
      included: [
        { value: "Accommodation for 2 nights" },
        { value: "All meals (breakfast, lunch, dinner)" },
        { value: "Transportation (AC bus)" },
        { value: "Professional tour guide" },
      ],
      excluded: [
        { value: "Personal expenses" },
        { value: "Extra activities not mentioned" },
        { value: "Travel insurance" },
      ],
      amenities: [
        { value: "Air-conditioned rooms" },
        { value: "Free WiFi" },
        { value: "Swimming pool access" },
        { value: "Beach access" },
      ],
      tourPlan: [
        { value: "Day 1: Arrival and beach exploration" },
        { value: "Day 2: Himchari National Park visit" },
        { value: "Day 3: Inani Beach and departure" },
      ],
      maxGuest: "25",
      minAge: "5",
      division: "",
      tourType: "",
    },
  });





  // INcluded
  const { fields: includedFields, append: appendIncluded, remove: IncludedRemove } = useFieldArray({
    control: form.control,
    name: "included",
  })
  // EXcluded
  const { fields: excludedFields, append: appendExcluded, remove: excludedRemove } = useFieldArray({
    control: form.control,
    name: "excluded",
  })
  // animatedFields
  const { fields: amenitiesFields, append: appendAmenities, remove: removeAmenities, } = useFieldArray({
    control: form.control,
    name: "amenities",
  });
  // tour Plan Field
  const { fields: tourPlanFields, append: appendTourPlan, remove: removeTourPlan, } = useFieldArray({
    control: form.control,
    name: "tourPlan",
  });





  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true)
    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      maxGuest: Number(data.maxGuest),
      minAge: Number(data.minAge),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included:
        data.included[0].value === ""
          ? []
          : data.included.map((item: { value: string }) => item.value),
      excluded:
        data.excluded[0].value === ""
          ? []
          : data.excluded.map((item: { value: string }) => item.value),
      amenities:
        data.amenities[0].value === ""
          ? []
          : data.amenities.map((item: { value: string }) => item.value),
      tourPlan:
        data.tourPlan[0].value === ""
          ? []
          : data.tourPlan.map((item: { value: string }) => item.value),
    };


    // formData
    const formData = new FormData()
    formData.append("data", JSON.stringify(tourData))
    images.forEach((image) => formData.append("files", image as File));//image
    try {

      const res = await addTour(formData).unwrap()
      if (res.success) {
        toast.success("Tour Create Successfully")
        form.reset()
      }

    } catch (error) {
      console.error("Error adding tour:", error)
      toast.error("Failed to create tour!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Add New Tour</CardTitle>
        <CardDescription className="text-center">
          Add a new tour to the system
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tour Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="Enter tour title"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* location and CostForm */}
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costFrom"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* DepartureLocation and arrivalLocation */}
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="departureLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Departure Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalLocation"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Arrival Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* tourTYPE */}
            <FormField
              control={form.control}
              name="tourType"
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Tour Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={tourLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tourTypeOptions?.map(
                        (option: { value: string; label: string }) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Country and Division */}
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Division</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        const selected = divisionOptions?.find((d) => d.value === val);
                        if (selected) {
                          form.setValue("country", selected.country);
                        }
                      }}
                      defaultValue={field.value}
                      disabled={divisionLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisionOptions?.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>
            {/* maxGuest and Minimun Guest */}
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="maxGuest"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Max Guest</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minAge"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Minimum Age</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* date Picker */}
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>StartDate</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}

                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

            </div>

            {/* description */}
            <div className="flex gap-5 items-stretch">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-[205px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ImageUpload */}
              <div className="flex-1 mt-5">
                <MultipleImageUpload onChange={setImage} />
              </div>

            </div>

            {/* Divide */}
            <div className="border-t border-muted w-full "></div>
            {/* Includes  */}
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Included</p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => appendIncluded({ value: "" })}
                >
                  <Plus />
                </Button>
              </div>
              {/* Includes Input */}
              <div className="space-y-4 mt-4">
                {includedFields.map((item, index) => (
                  <div className="flex gap-2" key={item.id}>
                    <FormField
                      control={form.control}
                      name={`included.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => IncludedRemove(index)}
                      variant="destructive"
                      className="!bg-red-700"
                      size="icon"
                      type="button"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded  Button*/}
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Excluded</p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => appendExcluded({ value: "" })}
                >
                  <Plus />
                </Button>
              </div>
              {/* excludes Input*/}
              <div className="space-y-4 mt-4">
                {excludedFields.map((item, index) => (
                  <div className="flex gap-2" key={item.id}>
                    <FormField
                      control={form.control}
                      name={`excluded.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => excludedRemove(index)}
                      variant="destructive"
                      className="!bg-red-700"
                      size="icon"
                      type="button"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>


            {/* Amenities  */}
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Amenities</p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => appendAmenities({ value: "" })}
                >
                  <Plus />
                </Button>
              </div>
              {/* Includes Input */}
              <div className="space-y-4 mt-4">
                {amenitiesFields.map((item, index) => (
                  <div className="flex gap-2" key={item.id}>
                    <FormField
                      control={form.control}
                      name={`amenities.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => removeAmenities(index)}
                      variant="destructive"
                      className="!bg-red-700"
                      size="icon"
                      type="button"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Plan  */}
            <div>
              <div className="flex justify-between">
                <p className="font-semibold">Tour Plan</p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => appendTourPlan({ value: "" })}
                >
                  <Plus />
                </Button>
              </div>
              {/* Tour Input */}
              <div className="space-y-4 mt-4">
                {tourPlanFields.map((item, index) => (
                  <div className="flex gap-2" key={item.id}>
                    <FormField
                      control={form.control}
                      name={`tourPlan.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => removeTourPlan(index)}
                      variant="destructive"
                      className="!bg-red-700"
                      size="icon"
                      type="button"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && (<FaSpinner className="mr-2 h-4 w-4 animate-spin" />)}
                {loading ? "Creating Tour..." : "Create Tour"}
              </Button>
            </DialogFooter>
          </form>

        </Form>
      </CardContent>
    </Card>
  );
}
