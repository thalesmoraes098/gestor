'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonorsTable } from "@/components/donors-table";
import { DonorsFilterDialog } from "@/components/donors-filter-dialog";
import { Filter, PlusCircle } from "lucide-react";

const donorsData = [
  { id: 'DON001', name: 'João da Silva', email: 'joao.silva@example.com', status: 'Ativo', assessor: 'Carlos Almeida', amount: 150.00, joinDate: '2023-01-15', history: [
    { date: '2024-07-15', amount: 150.00, status: 'Pago' },
    { date: '2024-06-15', amount: 150.00, status: 'Pago' },
    { date: '2024-05-15', amount: 150.00, status: 'Pago' },
  ]},
  { id: 'DON002', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 200.00, joinDate: '2023-02-20', history: [
    { date: '2024-07-20', amount: 200.00, status: 'Pago' },
    { date: '2024-06-20', amount: 200.00, status: 'Pendente' },
    { date: '2024-05-20', amount: 200.00, status: 'Pago' },
  ]},
  { id: 'DON003', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', status: 'Inativo', assessor: 'Carlos Almeida', amount: 50.00, joinDate: '2023-03-10', history: [
    { date: '2024-03-10', amount: 50.00, status: 'Pago' },
    { date: '2024-02-10', amount: 50.00, status: 'Falhou' },
  ]},
  { id: 'DON004', name: 'Ana Costa', email: 'ana.costa@example.com', status: 'Ativo', assessor: 'Direto', amount: 100.00, joinDate: '2023-04-05', history: [
    { date: '2024-07-05', amount: 100.00, status: 'Pago' },
  ]},
  { id: 'DON005', name: 'Pedro Santos', email: 'pedro.santos@example.com', status: 'Pendente', assessor: 'Juliana Lima', amount: 75.00, joinDate: '2023-05-12', history: []},
  { id: 'DON006', name: 'Sofia Lima', email: 'sofia.lima@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 300.00, joinDate: '2023-06-18', history: [
    { date: '2024-07-18', amount: 300.00, status: 'Pago' },
    { date: '2024-06-18', amount: 300.00, status: 'Pago' },
  ]},
  { id: 'DON007', name: 'Lucas Souza', email: 'lucas.souza@example.com', status: 'Inativo', assessor: 'Direto', amount: 25.00, joinDate: '2023-07-22', history: [
    { date: '2024-01-22', amount: 25.00, status: 'Pago' },
  ]},
];

export default function DoadoresPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <DonorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
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
            <Button className="h-12 rounded-lg font-semibold text-base">
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doador
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            <DonorsTable data={donorsData} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
