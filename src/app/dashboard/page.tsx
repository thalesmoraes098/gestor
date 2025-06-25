import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, HandHeart, Users, Bike } from "lucide-react"
import { AdvisorSalesChart, MessengerPerformanceChart } from "@/components/dashboard-charts"

const kpiData = [
    { title: "Total de Doações", value: "R$ 0,00", icon: DollarSign, description: "0 doações este mês" },
    { title: "Novos Doadores", value: "+0", icon: Users, description: "Nenhum novo doador" },
    { title: "Doações Pendentes", value: "0", icon: HandHeart, description: "Nenhuma pendência" },
    { title: "Coletas Realizadas", value: "0", icon: Bike, description: "Nenhuma coleta hoje" },
]

const advisorData = [
  { name: 'Alice', total: 4500 },
  { name: 'Bruno', total: 3000 },
  { name: 'Carla', total: 5200 },
  { name: 'Daniel', total: 2800 },
  { name: 'Eva', total: 4800 },
]

const messengerData = [
  { name: 'Fábio', collections: 110 },
  { name: 'Gabi', collections: 95 },
  { name: 'Hugo', collections: 130 },
  { name: 'Íris', collections: 80 },
  { name: 'Leo', collections: 125 },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
                <Card key={kpi.title} className="rounded-2xl border-0 shadow-lg">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Desempenho por Assessor</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <AdvisorSalesChart data={advisorData} />
                </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Desempenho por Mensageiro</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <MessengerPerformanceChart data={messengerData} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
