import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarIcon, Loader2, RefreshCw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { OrderFilters } from "@/types/orders"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

type OrderFiltersProps = {
  filters: OrderFilters
  onFilterChange: (filters: OrderFilters) => void
  refetch: () => void,
  refreshLoade: boolean
}

const statuses = ["pending", "assigned", "picked", "delivered"]
const areas = ["Downtown", "Uptown", "Midtown", "Suburbs"] // Add or modify areas as needed

export function OrderFiltersComponent({ filters, onFilterChange, refetch, refreshLoade }: OrderFiltersProps) {

  const handleStatusChange = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status]
    onFilterChange({ ...filters, status: newStatus })
  }

  const handleAreaChange = (area: string) => {
    const newAreas = filters.areas.includes(area) ? filters.areas.filter((a) => a !== area) : [...filters.areas, area]
    onFilterChange({ ...filters, areas: newAreas })
  }

  const handleDateChange = (date: Date | undefined) => {
    onFilterChange(
      { ...filters, date: date ? format(date, "yyyy-MM-dd") : "" }
    )
  }

  const clearFilters = () => {
    onFilterChange({ status: [], areas: [], date: "" })
  }

  return (

    <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">

      <div className="flex flex-col sm:flex-row gap-4 items-end">

        <div className="w-full sm:w-auto">
          <Label className="text-lg font-semibold block">Status</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[150px]">
                {filters.status.length === 0 ? "Select Status" : `${filters.status.length} selected`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => handleStatusChange(status)}
                >
                  <span className="capitalize">{status}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full sm:w-auto">
          <Label className="text-lg font-semibold block">Area</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[150px]">
                {filters.areas.length === 0 ? "Select Area" : `${filters.areas.length} selected`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {areas.map((area) => (
                <DropdownMenuCheckboxItem
                  key={area}
                  checked={filters.areas.includes(area)}
                  onCheckedChange={() => handleAreaChange(area)}
                >
                  {area}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full sm:w-auto">
          <Label className="text-lg font-semibold block">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[180px]">
                {filters.date ? format(new Date(filters.date), "PPP") : "Select date"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date ? new Date(filters.date) : undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full sm:w-[150px]"
        >
          Clear Filters
        </Button>
      </div>

      <div className="w-full sm:w-auto">
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={refreshLoade}
          className="w-full sm:w-auto"
        >
          {refreshLoade ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>
    </div>


  )
}

