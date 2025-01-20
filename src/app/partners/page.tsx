"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Partners } from "./partners";
import { DeliveryPartner } from "@/types/partner";


const queryClient = new QueryClient()

// Main content component
function PartnersContent() {
  const { data: partners = [], isLoading, error } = useQuery<DeliveryPartner[]>({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await axios.get("/api/partners");
      return data.partners;
    },
    staleTime: 60000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  const metrics = {
    totalActive: partners.filter((p) => p.status === "active").length,
    avgRating: partners.length > 0
      ? partners.reduce((sum, p) => sum + (p.metrics?.rating || 0), 0) / partners.length
      : 0,
    topAreas: [...new Set(partners.flatMap((p) => p.areas || []))].slice(0, 3),
  };

  return <Partners partners={partners} metrics={metrics} />;
}

// Main page component
export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <PartnersContent />
    </QueryClientProvider>
  );
}