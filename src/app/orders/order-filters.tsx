import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { OrderFilters } from "@/types/orders"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type OrderFiltersProps = {
  filters: OrderFilters
  onFilterChange: (filters: OrderFilters) => void
}

export function OrderFiltersComponent({ filters, onFilterChange }: OrderFiltersProps) {

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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, date: event.target.value })
  }

  const clearFilters = () => {
    onFilterChange({ status: [], areas: [], date: "" })
  }

  const statuses = ["pending", "assigned", "picked", "delivered"]
  const areas = ["Downtown", "Uptown", "Midtown", "Suburbs"]

  return (

    <div className="flex flex-wrap gap-4 items-start">

      <div>
        <Label className="text-lg font-semibold">Status</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-2">
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

      <div>
        <Label className="text-lg font-semibold">Area</Label>
        <div className="mt-2 space-y-2">
          {areas.map((area) => (
            <div key={area} className="flex items-center">
              <Checkbox
                id={`area-${area}`}
                checked={filters.areas.includes(area)}
                onCheckedChange={() => handleAreaChange(area)}
              />
              <label htmlFor={`area-${area}`} className="ml-2">
                {area}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="date" className="text-lg font-semibold">
          Date
        </Label>
        <Input id="date" type="date" value={filters.date} onChange={handleDateChange} className="mt-2" />
      </div>
      <Button onClick={clearFilters} variant="outline" className="mt-8">
        Clear Filters
      </Button>
    </div>
  )
}

