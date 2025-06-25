import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { DonorsTable } from "@/components/donors-table";

const donorsData = [
  { id: 'DON001', name: 'João da Silva', email: 'joao.silva@example.com', status: 'Ativo', amount: 150.00, joinDate: '2023-01-15' },
  { id: 'DON002', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', status: 'Ativo', amount: 200.00, joinDate: '2023-02-20' },
  { id: 'DON003', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', status: 'Inativo', amount: 50.00, joinDate: '2023-03-10' },
  { id: 'DON004', name: 'Ana Costa', email: 'ana.costa@example.com', status: 'Ativo', amount: 100.00, joinDate: '2023-04-05' },
  { id: 'DON005', name: 'Pedro Santos', email: 'pedro.santos@example.com', status: 'Pendente', amount: 75.00, joinDate: '2023-05-12' },
  { id: 'DON006', name: 'Sofia Lima', email: 'sofia.lima@example.com', status: 'Ativo', amount: 300.00, joinDate: '2023-06-18' },
  { id: 'DON007', name: 'Lucas Souza', email: 'lucas.souza@example.com', status: 'Inativo', amount: 25.00, joinDate: '2023-07-22' },
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar doador..."
              className="pl-10 pr-4 h-12 rounded-lg bg-primary/10 border-0 focus-visible:ring-primary"
            />
          </div>
          <Button className="h-12 rounded-lg font-semibold text-base">
            <PlusCircle className="mr-2 h-5 w-5" />
            Adicionar Doador
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Doadores</CardTitle>
          <CardDescription>
            Um total de {donorsData.length} doadores encontrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorsTable data={donorsData} />
        </CardContent>
      </Card>
    </div>
  );
}
