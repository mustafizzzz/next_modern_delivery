'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DeliveryPartner } from '@/types/partner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Users,
  Star,
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  MoreVertical,
  Check,
  X
} from 'lucide-react';


type PartnersPageProps = {
  partners: DeliveryPartner[]
  metrics: {
    totalActive: number
    avgRating: number
    topAreas: string[]
  }
}

export function Partners({ partners, metrics }: PartnersPageProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Delivery Partners</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <MetricCard title="Total Active Partners" value={metrics.totalActive} />
        <MetricCard title="Average Rating" value={metrics.avgRating.toFixed(2)} />
        <MetricCard title="Top Areas" value={metrics.topAreas.join(', ')} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search partners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Link href="/partners/register">
          <Button>
            <Plus size={30} />
            Register New Partner
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Load</TableHead>
                <TableHead>Areas</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner._id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.email}</TableCell>
                  <TableCell>{partner.phone}</TableCell>
                  <TableCell>
                    <Badge variant={partner.status === 'active' ? 'outline' : 'secondary'}>
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{partner.currentLoad}/3</TableCell>
                  <TableCell>{partner.areas.join(', ')}</TableCell>
                  <TableCell>
                    <Link href={`/partners/edit/${partner._id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

