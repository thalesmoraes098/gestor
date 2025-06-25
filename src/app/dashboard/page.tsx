import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, HandHeart, Users, Bike } from "lucide-react"
import { AdvisorSalesChart, CommissionTrendChart } from "@/components/dashboard-charts"

const kpiData = [
    { title: "Total de Doações", value: "R$ 0,00", icon: DollarSign, description: "0 doações este mês" },
    { title: "Novos Doadores", value: "+0", icon: Users, description: "Nenhum novo doador" },
    { title: "Doações Pendentes", value: "0", icon: HandHeart, description: "Nenhuma pendência" },
    { title: "Coletas Realizadas", value: "0", icon: Bike, description: "Nenhuma coleta hoje" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
                <Card key={kpi.title} className="rounded-2xl border-0 shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                        <kpi.icon className="w-5 h-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3 rounded-2xl border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Visão Geral das Doações</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <CommissionTrendChart data={[]} />
                </CardContent>
            </Card>
            <Card className="lg:col-span-2 rounded-2xl border-0 shadow-sm">
                <CardHeader>
                    <CardTitle>Doações por Assessor</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <AdvisorSalesChart data={[]} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
