import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonorsTable } from "@/components/donors-table";
import { Filter, PlusCircle } from "lucide-react";

const donorsData = [
  { id: 'DON001', name: 'João da Silva', email: 'joao.silva@example.com', status: 'Ativo', assessor: 'Carlos Almeida', amount: 150.00, joinDate: '2023-01-15' },
  { id: 'DON002', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 200.00, joinDate: '2023-02-20' },
  { id: 'DON003', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', status: 'Inativo', assessor: 'Carlos Almeida', amount: 50.00, joinDate: '2023-03-10' },
  { id: 'DON004', name: 'Ana Costa', email: 'ana.costa@example.com', status: 'Ativo', assessor: 'Direto', amount: 100.00, joinDate: '2023-04-05' },
  { id: 'DON005', name: 'Pedro Santos', email: 'pedro.santos@example.com', status: 'Pendente', assessor: 'Juliana Lima', amount: 75.00, joinDate: '2023-05-12' },
  { id: 'DON006', name: 'Sofia Lima', email: 'sofia.lima@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 300.00, joinDate: '2023-06-18' },
  { id: 'DON007', name: 'Lucas Souza', email: 'lucas.souza@example.com', status: 'Inativo', assessor: 'Direto', amount: 25.00, joinDate: '2023-07-22' },
];

export default function DoadoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Doadores</h1>
          <p className="text-muted-foreground">Gerencie os doadores da sua organização.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 rounded-lg text-base">
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
  );
}
