import TourFilter from "@/components/models/Tour/TourFilter"
import { Button } from "@/components/ui/button"
import { useGetAllTourQuery } from "@/redux/feature/Tour/tour.api"
import Loading from "@/utils/Loading"
import { Link, useSearchParams } from "react-router"

export default function Tour() { 
   const [searchParams] = useSearchParams();

  const division = searchParams.get("division") || undefined;
  const tourType = searchParams.get("tourType") || undefined;

  const { data, isLoading, isError } = useGetAllTourQuery({division,tourType})

  if (isLoading || isError) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-5 py-8 grid grid-cols-12 gap-5">
      <TourFilter />
      <div  className="col-span-9 space-y-3.5 w-full">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.slug}
              className="border border-muted rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
            >
              {/* Image */}
              <div className="w-full md:w-2/5 h-48 md:h-auto bg-red-500 flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-3">{item.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-primary">
                    Cost ৳{item.costFrom.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Max {item.maxGuest} guests
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span> {item.departureLocation}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {item.arrivalLocation}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {item.tourPlan.length} days
                  </div>
                  <div>
                    <span className="font-medium">Min Age:</span> {item.minAge}+
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted/50 text-primary text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                  {item.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                      +{item.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <Button asChild className="w-full mt-auto">
                  <Link to={`/tours/${item._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          // যদি কোনো টুর না থাকে
          <div className="border border-muted rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center h-64 p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Tour is not available</h3>
            <p className="text-muted-foreground mb-4">
              Currently there are no tours to display. Please check back later.
            </p>
            <Button asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </div>
        )}
      </div>

    </div>

  )
}
