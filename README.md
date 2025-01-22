This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the modules then run the development server:

```bash
npm install --legacy-peer-deps
# then
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Smart Delivery Management System


The Smart Delivery Management System is a comprehensive web application designed to streamline and optimize the process of managing deliveries, partners, and orders. This system provides a user-friendly interface for tracking orders, managing delivery partners, and visualizing key metrics on a dashboard.

## Features

1. **Dashboard**
   - Overview of key metrics (active partners, today's orders, assignment success rate, partner ratings)
   - Interactive map showing active orders
   - Today's scheduled orders table
   - Partner availability status
   - Recent assignments list

2. **Partners Management**
   - List view of all delivery partners
   - Partner registration form
   - Partner editing functionality
   - Partner metrics (rating, completed orders, cancelled orders)

3. **Orders Management**
   - List view of all orders with filtering options
   - Order details view
   - Order assignment to partners
   - Order status tracking (pending, assigned, picked, delivered, failed)

4. **Active Order Map**
   - Real-time visualization of order locations
   - Clustered markers for multiple orders in the same area
   - Order details on marker click

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query
- Leaflet (for maps)
