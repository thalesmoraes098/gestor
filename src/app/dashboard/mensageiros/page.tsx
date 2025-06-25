'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessengersTable } from "@/components/messengers-table";
import { MessengersFilterDialog } from "@/components/messengers-filter-dialog";
import { AddMessengerDialog } from "@/components/add-messenger-dialog";
import { Filter, PlusCircle } from "lucide-react";

type Messenger = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Férias' | 'Licença Médica' | 'Suspensão' | 'Demitido';
};

const messengersData: Messenger[] = [
  { id: 'MEN001', name: 'Fábio Souza', email: 'fabio.souza@example.com', phone: '(11) 91111-1111', status: 'Ativo' },
  { id: 'MEN002', name: 'Gabi Lima', email: 'gabi.lima@example.com', phone: '(21) 92222-2222', status: 'Ativo' },
  { id: 'MEN003', name: 'Hugo Costa', email: 'hugo.costa@example.com', phone: '(51) 93333-3333', status: 'Férias' },
  { id: 'MEN004', name: 'Leo Martins', email: 'leo.martins@example.com', phone: '(31) 94444-4444', status: 'Demitido' },
  { id: 'MEN005', name: 'Íris Alves', email: 'iris.alves@example.com', phone: '(41) 95555-5555', status: 'Licença Médica' },
];

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
