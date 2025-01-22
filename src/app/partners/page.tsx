"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Partners } from "./partners";
import { DeliveryPartner } from "@/types/partner";
import { Loader2 } from "lucide-react";


const queryClient = new QueryClient()

// Main content component
function PartnersContent() {

  const [refreshLoade, setRefreshLoade] = useState(false);

  const { data: partners = [], isLoading, error, refetch } = useQuery<DeliveryPartner[]>({

    queryKey: ["partners"],
    queryFn: async () => {
      try {
        setRefreshLoade(true);
        const { data } = await axios.get("/api/partners");
        return data.partners;
      } catch (error) {
        console.error("Error fetching partners", error);
      } finally {
        setRefreshLoade(false);
      }

    },
    staleTime: 60000,
  });


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
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

  return <Partners partners={partners} metrics={metrics} refetch={refetch} refreshLoade={refreshLoade} />;
}

// Main page component
export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <PartnersContent />
    </QueryClientProvider>
  );
}