'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonationsTable } from "@/components/donations-table";
import { DonationsFilterDialog } from "@/components/donations-filter-dialog";
import { AddDonationDialog } from "@/components/add-donation-dialog";
import { Filter, PlusCircle } from "lucide-react";

type Donation = {
  id: string;
  donorName: string;
  donorCode: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado';
  assessor: string;
  messenger: string;
  paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'PIX';
};

const donationsData: Donation[] = [
    { id: 'DOA001', donorName: 'João da Silva', donorCode: '001', amount: 150.00, paymentDate: '2024-07-15', dueDate: '2024-07-15', status: 'Pago', assessor: 'Carlos Almeida', messenger: 'Fábio', paymentMethod: 'Dinheiro' },
    { id: 'DOA002', donorName: 'Maria Oliveira', donorCode: '002', amount: 200.00, paymentDate: '', dueDate: '2024-07-20', status: 'Pendente', assessor: 'Ana Beatriz', messenger: 'Gabi', paymentMethod: 'Cartão de Crédito' },
    { id: 'DOA003', donorName: 'Ana Costa', donorCode: '004', amount: 100.00, paymentDate: '2024-07-06', dueDate: '2024-07-05', status: 'Pago', assessor: 'Direto', messenger: 'Hugo', paymentMethod: 'PIX' },
    { id: 'DOA004', donorName: 'Sofia Lima', donorCode: '006', amount: 300.00, paymentDate: '', dueDate: '2024-06-18', status: 'Atrasado', assessor: 'Ana Beatriz', messenger: 'Leo', paymentMethod: 'Dinheiro' },
    { id: 'DOA005', donorName: 'Carlos Pereira', donorCode: '003', amount: 50.00, paymentDate: '', dueDate: '2024-03-10', status: 'Cancelado', assessor: 'Carlos Almeida', messenger: '-', paymentMethod: 'Dinheiro' },
];

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
