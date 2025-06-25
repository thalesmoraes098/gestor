import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Clock, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total de Doações</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ 0,00</div>
                    <p className="text-xs text-muted-foreground">0 doações registradas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total de Comissões</CardTitle>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">R$ 0,00</div>
                    <p className="text-xs text-muted-foreground">Calculado sobre doações vinculadas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">0 Assessores, 0 Mensageiros</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Comissões por Assessor</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full pb-6">
                    <div className="text-center text-muted-foreground">
                        <p>Nenhum dado de comissão para assessores.</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Comissões por Mensageiro</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full pb-6">
                     <div className="text-center text-muted-foreground">
                        <p>Nenhum dado de comissão para mensageiros.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
