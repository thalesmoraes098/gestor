'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, HandHeart, Users, Bike, Trophy } from "lucide-react"
import { AdvisorSalesChart, MessengerPerformanceChart } from "@/components/dashboard-charts"
import { advisorsData, donationsData, donorsData, messengersData } from "@/lib/mock-data";
import { useEffect, useState } from "react";

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [advisorPerformanceData, setAdvisorPerformanceData] = useState<any[]>([]);
  const [messengerPerformanceData, setMessengerPerformanceData] = useState<any[]>([]);
  const [bestAdvisor, setBestAdvisor] = useState<{ name: string; value: number } | null>(null);
  const [bestMessenger, setBestMessenger] = useState<{ name: string; value: number } | null>(null);

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

    // Chart and Ranking Data Calculations
    const advisorData = advisorsData
      .filter(a => a.status === 'Ativo')
      .map(advisor => {
        const total = donationsThisMonth
          .filter(d => d.assessor === advisor.name)
          .reduce((sum, d) => sum + d.amount, 0);
        return { name: advisor.name, total };
      });

    setAdvisorPerformanceData(advisorData.filter(item => item.total > 0));
    
    if (advisorData.length > 0) {
        const topAdvisor = advisorData.reduce((prev, current) => (prev.total > current.total) ? prev : current);
        if (topAdvisor.total > 0) {
            setBestAdvisor({ name: topAdvisor.name, value: topAdvisor.total });
        } else {
            setBestAdvisor(null);
        }
    } else {
        setBestAdvisor(null);
    }

    const messengerData = messengersData
      .filter(m => m.status === 'Ativo')
      .map(messenger => {
        const collections = donationsThisMonth.filter(d => d.messenger === messenger.name).length;
        return { name: messenger.name, collections };
      });

    setMessengerPerformanceData(messengerData.filter(item => item.collections > 0));

    if (messengerData.length > 0) {
        const topMessenger = messengerData.reduce((prev, current) => (prev.collections > current.collections) ? prev : current);
        if (topMessenger.collections > 0) {
            setBestMessenger({ name: topMessenger.name, value: topMessenger.collections });
        } else {
            setBestMessenger(null);
        }
    } else {
        setBestMessenger(null);
    }

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
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle>Melhor Assessor do Mês</CardTitle>
                        <p className="text-sm text-muted-foreground">Ranking de arrecadação do mês atual.</p>
                    </div>
                </CardHeader>
                <CardContent>
                    {bestAdvisor ? (
                        <div className="flex items-center gap-4">
                            <img src="https://placehold.co/64x64.png" alt="Avatar do melhor assessor" className="w-16 h-16 rounded-full" data-ai-hint="person trophy" />
                            <div>
                                <p className="text-lg font-bold">{bestAdvisor.name}</p>
                                <p className="text-xl font-semibold text-primary">{formatCurrency(bestAdvisor.value)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[64px]">
                            <p className="text-muted-foreground">Nenhum resultado este mês.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="rounded-2xl border-0 shadow-lg">
                 <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle>Melhor Mensageiro do Mês</CardTitle>
                        <p className="text-sm text-muted-foreground">Ranking de coletas do mês atual.</p>
                    </div>
                </CardHeader>
                <CardContent>
                     {bestMessenger ? (
                        <div className="flex items-center gap-4">
                            <img src="https://placehold.co/64x64.png" alt="Avatar do melhor mensageiro" className="w-16 h-16 rounded-full" data-ai-hint="person trophy" />
                            <div>
                                <p className="text-lg font-bold">{bestMessenger.name}</p>
                                <p className="text-xl font-semibold text-primary">{bestMessenger.value} coletas</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[64px]">
                            <p className="text-muted-foreground">Nenhuma coleta este mês.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
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
