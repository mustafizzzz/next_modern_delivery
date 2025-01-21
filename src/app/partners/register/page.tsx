'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { deliveryPartnerSchema } from './../../../schemas/deliveryPartnerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,

} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react';
import axios from 'axios';

type FormData = z.infer<typeof deliveryPartnerSchema>

export default function RegisterPartner() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(deliveryPartnerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'active',
      currentLoad: 0,
      areas: [],
      shift: {
        start: '',
        end: '',
      },
      metrics: {
        rating: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      },
    },
  })

  const areas = ['Downtown', 'Midtown', 'Uptown', 'Suburbs', 'Waterfront']
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [open, setOpen] = useState(false);


  const handleAreaChange = useCallback((value: string) => {
    setSelectedAreas(prev => {
      const newAreas = prev.includes(value)
        ? prev.filter(a => a !== value)
        : [...prev, value];

      // Move form update outside of setState
      setTimeout(() => {
        setValue('areas', newAreas);
      }, 0);

      return newAreas;
    });
  }, [setValue]);

  const onSubmit = async (data: FormData) => {

    try {

      setIsLoading(true);
      const response = await axios.post(`http://localhost:3000/api/partners`, data);

      if (!response.data.success) {
        toast({
          title: 'Success!',
          description: response.data.message
        });
      } else {
        toast({
          title: 'Success!',
          description: response.data.message
        });
      }



      router.push('/partners');
    } catch (error) {

      console.error('Error submitting form:', error);

      toast({
        title: 'Error',
        description: 'There was an error while registering the partner.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register New Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label>Service Areas</Label>
              <Controller
                name="areas"
                control={control}
                render={() => (
                  <Select
                    open={open}
                    onOpenChange={setOpen}
                    onValueChange={handleAreaChange}
                    value=""
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        selectedAreas.length === 0
                          ? "Select Areas"
                          : `${selectedAreas.length} areas selected`
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {selectedAreas.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="default"
                      className="flex items-center gap-1"
                    >
                      {area}
                      <button
                        onClick={() => handleAreaChange(area)}
                        className="rounded-full p-0.5 ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {errors.areas && (
                <p className="text-red-500 text-sm mt-1">{errors.areas.message}</p>
              )}
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shift.start">Shift Start</Label>
                <Input
                  id="shift.start"
                  type="time"
                  {...register('shift.start')}
                  className={errors.shift?.start ? 'border-red-500' : ''}
                />
                {errors.shift?.start && (
                  <p className="text-red-500 text-sm mt-1">{errors.shift.start.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="shift.end">Shift End</Label>
                <Input
                  id="shift.end"
                  type="time"
                  {...register('shift.end')}
                  className={errors.shift?.end ? 'border-red-500' : ''}
                />
                {errors.shift?.end && (
                  <p className="text-red-500 text-sm mt-1">{errors.shift.end.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </>
              ) : (
                'Register Partner'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

