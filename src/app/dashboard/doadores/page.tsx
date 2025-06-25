'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonorsTable } from "@/components/donors-table";
import { DonorsFilterDialog } from "@/components/donors-filter-dialog";
import { AddDonorDialog } from "@/components/add-donor-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Donor } from "@/lib/mock-data";
import { donorsData } from "@/lib/mock-data";

export default function DoadoresPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false);
  const [donorToEdit, setDonorToEdit] = useState<Donor | null>(null);

  const handleEdit = (donor: Donor) => {
    setDonorToEdit(donor);
    setIsDonorDialogOpen(true);
  };

  const handleAdd = () => {
    setDonorToEdit(null);
    setIsDonorDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
      setIsDonorDialogOpen(open);
      if (!open) {
          setDonorToEdit(null);
      }
  }

  return (
    <>
      <DonorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
      <AddDonorDialog open={isDonorDialogOpen} onOpenChange={handleDialogChange} donor={donorToEdit} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doadores</h1>
            <p className="text-muted-foreground">Gerencie os doadores da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doador
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <DonorsTable data={donorsData} onEdit={handleEdit} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
