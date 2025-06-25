'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonationsTable } from "@/components/donations-table";
import { DonationsFilterDialog } from "@/components/donations-filter-dialog";
import { AddDonationDialog } from "@/components/add-donation-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Donation } from "@/lib/mock-data";
import { donationsData } from "@/lib/mock-data";

export default function DoacoesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [donationToEdit, setDonationToEdit] = useState<Donation | null>(null);

  const handleEdit = (donation: Donation) => {
    setDonationToEdit(donation);
    setIsDonationDialogOpen(true);
  };

  const handleAdd = () => {
    setDonationToEdit(null);
    setIsDonationDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
      setIsDonationDialogOpen(open);
      if (!open) {
          setDonationToEdit(null);
      }
  }

  return (
    <>
      <DonationsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
      <AddDonationDialog open={isDonationDialogOpen} onOpenChange={handleDialogChange} donation={donationToEdit} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doações</h1>
            <p className="text-muted-foreground">Gerencie as doações recebidas.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doação
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <DonationsTable data={donationsData} onEdit={handleEdit} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
