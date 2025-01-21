'use client'

import { use, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { deliveryPartnerSchema } from '../../../../schemas/deliveryPartnerSchema';
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

export default function EditPartner({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(deliveryPartnerSchema),
  });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          toast({
            title: "Error",
            description: "Invalid partner ID.",
            variant: "destructive",
          });
          router.push("/partners");
          return;
        }

        const response = await axios.get(`/api/partners/${id}`);
        if (response.data.success === false) {
          toast({
            title: 'Error',
            description: response.data.message,
          })
          router.push('/partners');
        }
        reset(response.data.partner);
        setSelectedAreas(response.data.partner.areas || []);
      } catch (error) {

        console.error('Error getting partner:', error);

        toast({
          title: 'Error',
          description: 'Error getting partner. Please try again later.',
        })

        router.push('/partners');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartner();
  }, [id])



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
      console.log(data);
      const response = await axios.put(`/api/partners/${id}`, data);
      console.log("updated::::", response)
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Partner updated successfully',
        });
        setIsLoading(false);
        router.push('/partners');
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update partner',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Partner</CardTitle>
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
                defaultValue={selectedAreas}
                render={({ field }) => (
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

            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
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

            <Button type="submit" className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                </>
              ) : (
                'Update Partner'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}