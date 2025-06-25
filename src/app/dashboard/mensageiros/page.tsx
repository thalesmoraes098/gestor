'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessengersTable } from "@/components/messengers-table";
import { MessengersFilterDialog } from "@/components/messengers-filter-dialog";
import { AddMessengerDialog } from "@/components/add-messenger-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Messenger } from "@/lib/mock-data";
import { messengersData } from "@/lib/mock-data";

export default function MensageirosPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMessengerDialogOpen, setIsMessengerDialogOpen] = useState(false);
  const [messengerToEdit, setMessengerToEdit] = useState<Messenger | null>(null);

  const handleEdit = (messenger: Messenger) => {
    setMessengerToEdit(messenger);
    setIsMessengerDialogOpen(true);
  };

  const handleAdd = () => {
    setMessengerToEdit(null);
    setIsMessengerDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
      setIsMessengerDialogOpen(open);
      if (!open) {
          setMessengerToEdit(null);
      }
  }

  return (
    <>
      <MessengersFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
      <AddMessengerDialog 
        open={isMessengerDialogOpen} 
        onOpenChange={handleDialogChange} 
        messenger={messengerToEdit} 
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mensageiros</h1>
            <p className="text-muted-foreground">Gerencie os mensageiros da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Mensageiro
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <MessengersTable data={messengersData} onEdit={handleEdit} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
