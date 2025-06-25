'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, HandHeart, Users, Bike } from "lucide-react"
import { AdvisorSalesChart, MessengerPerformanceChart } from "@/components/dashboard-charts"
import { advisorsData, donationsData, donorsData, messengersData } from "@/lib/mock-data";
import { useEffect, useState } from "react";

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [advisorPerformanceData, setAdvisorPerformanceData] = useState<any[]>([]);
  const [messengerPerformanceData, setMessengerPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const todayString = today.toISOString().split('T')[0];

    // KPI Calculations
    const donationsThisMonth = donationsData.filter(d => {
      if (!d.paymentDate) return false;
      const paymentDate = new Date(d.paymentDate);
      return d.status === 'Pago' && paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    const totalDonationsValue = donationsThisMonth.reduce((sum, d) => sum + d.amount, 0);

    const newDonorsThisMonth = donorsData.filter(d => {
      const joinDate = new Date(d.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    const pendingDonationsCount = donationsData.filter(d => d.status === 'Pendente').length;

    const collectionsTodayCount = donationsData.filter(d => {
      return d.status === 'Pago' &&
        d.paymentDate === todayString &&
        (d.paymentMethod === 'Coleta' || d.paymentMethod === 'Dinheiro');
    }).length;

    setKpiData([
      { title: "Total de Doações", value: formatCurrency(totalDonationsValue), icon: DollarSign, description: `${donationsThisMonth.length} doações este mês` },
      { title: "Novos Doadores", value: `+${newDonorsThisMonth}`, icon: Users, description: newDonorsThisMonth > 0 ? `+${newDonorsThisMonth} este mês` : "Nenhum novo doador" },
      { title: "Doações Pendentes", value: String(pendingDonationsCount), icon: HandHeart, description: pendingDonationsCount > 0 ? `${pendingDonationsCount} doações pendentes` : "Nenhuma pendência" },
      { title: "Coletas Realizadas", value: String(collectionsTodayCount), icon: Bike, description: collectionsTodayCount > 0 ? `${collectionsTodayCount} coletas hoje` : "Nenhuma coleta hoje" },
    ]);

    // Chart Data Calculations
    const advisorData = advisorsData
      .filter(a => a.status === 'Ativo')
      .map(advisor => {
        const total = donationsThisMonth
          .filter(d => d.assessor === advisor.name)
          .reduce((sum, d) => sum + d.amount, 0);
        return { name: advisor.name, total };
      })
      .filter(item => item.total > 0);

    setAdvisorPerformanceData(advisorData);

    const messengerData = messengersData
      .filter(m => m.status === 'Ativo')
      .map(messenger => {
        const collections = donationsThisMonth.filter(d => d.messenger === messenger.name).length;
        return { name: messenger.name, collections };
      })
      .filter(item => item.collections > 0);

    setMessengerPerformanceData(messengerData);

  }, []);


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
                    <AdvisorSalesChart data={advisorPerformanceData} />
                </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Desempenho por Mensageiro</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <MessengerPerformanceChart data={messengerPerformanceData} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
