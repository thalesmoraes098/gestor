'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonorsTable } from "@/components/donors-table";
import { DonorsFilterDialog } from "@/components/donors-filter-dialog";
import { AddDonorDialog } from "@/components/add-donor-dialog";
import { Filter, PlusCircle } from "lucide-react";

type Donor = {
  id: string;
  code: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  assessor: string;
  amount: number;
  joinDate: string;
  isLoyal: boolean;
  paymentDay?: string;
  phones: { value: string }[];
  addresses: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    reference: string;
  }[];
  history: {
    date: string;
    amount: number;
    status: 'Pago' | 'Pendente' | 'Falhou';
  }[];
};


const donorsData: Donor[] = [
  { id: 'DON001', code: '001', name: 'João da Silva', email: 'joao.silva@example.com', status: 'Ativo', assessor: 'Carlos Almeida', amount: 150.00, joinDate: '2023-01-15', isLoyal: true, paymentDay: '15', phones: [{ value: '(11) 98765-4321' }], addresses: [{ cep: '01001-000', street: 'Praça da Sé', number: '10', complement: 'Lado A', neighborhood: 'Sé', city: 'São Paulo', state: 'SP', reference: 'Próximo à Catedral' }], history: [
    { date: '2024-07-15', amount: 150.00, status: 'Pago' },
    { date: '2024-06-15', amount: 150.00, status: 'Pago' },
    { date: '2024-05-15', amount: 150.00, status: 'Pago' },
  ]},
  { id: 'DON002', code: '002', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 200.00, joinDate: '2023-02-20', isLoyal: false, phones: [{ value: '(21) 91234-5678' }], addresses: [{ cep: '20031-912', street: 'Av. Graça Aranha', number: '1', complement: '', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ', reference: '' }], history: [
    { date: '2024-07-20', amount: 200.00, status: 'Pago' },
    { date: '2024-06-20', amount: 200.00, status: 'Pendente' },
    { date: '2024-05-20', amount: 200.00, status: 'Pago' },
  ]},
  { id: 'DON003', code: '003', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', status: 'Inativo', assessor: 'Carlos Almeida', amount: 50.00, joinDate: '2023-03-10', isLoyal: false, phones: [{value: '(31) 98888-7777'}], addresses: [], history: [
    { date: '2024-03-10', amount: 50.00, status: 'Pago' },
    { date: '2024-02-10', amount: 50.00, status: 'Falhou' },
  ]},
  { id: 'DON004', code: '004', name: 'Ana Costa', email: 'ana.costa@example.com', status: 'Ativo', assessor: 'Direto', amount: 100.00, joinDate: '2023-04-05', isLoyal: true, paymentDay: '5', phones: [{value: '(41) 96666-5555'}], addresses: [], history: [
    { date: '2024-07-05', amount: 100.00, status: 'Pago' },
  ]},
  { id: 'DON005', code: '005', name: 'Pedro Santos', email: 'pedro.santos@example.com', status: 'Pendente', assessor: 'Juliana Lima', amount: 75.00, joinDate: '2023-05-12', isLoyal: false, phones: [{value: '(51) 94444-3333'}], addresses: [], history: []},
  { id: 'DON006', code: '006', name: 'Sofia Lima', email: 'sofia.lima@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 300.00, joinDate: '2023-06-18', isLoyal: true, paymentDay: '20', phones: [{value: '(61) 92222-1111'}], addresses: [], history: [
    { date: '2024-07-18', amount: 300.00, status: 'Pago' },
    { date: '2024-06-18', amount: 300.00, status: 'Pago' },
  ]},
  { id: 'DON007', code: '007', name: 'Lucas Souza', email: 'lucas.souza@example.com', status: 'Inativo', assessor: 'Direto', amount: 25.00, joinDate: '2023-07-22', isLoyal: false, phones: [{value: '(71) 91111-0000'}], addresses: [], history: [
    { date: '2024-01-22', amount: 25.00, status: 'Pago' },
  ]},
];

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
