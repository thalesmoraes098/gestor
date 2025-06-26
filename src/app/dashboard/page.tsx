'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, HandHeart, Users, Bike, Trophy } from "lucide-react"
import { AdvisorSalesChart, MessengerPerformanceChart } from "@/components/dashboard-charts"
import { useEffect, useState, useMemo } from "react";
import { 
  donations as mockDonations,
  donors as mockDonors,
  advisors as mockAdvisors,
  messengers as mockMessengers,
} from "@/lib/mock-data";
import type { Advisor, Donation, Donor, Messenger } from "@/lib/mock-data";

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function DashboardPage() {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [donors, setDonors] = useState<Donor[]>(mockDonors);
  const [advisors, setAdvisors] = useState<Advisor[]>(mockAdvisors);
  const [messengers, setMessengers] = useState<Messenger[]>(mockMessengers);

  const {
    kpiData,
    advisorPerformanceData,
    messengerPerformanceData,
    bestAdvisor,
    bestMessenger,
  } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();
    const todayString = today.toISOString().split('T')[0];

    const donationsThisMonth = donations.filter(d => {
      if (!d.paymentDate) return false;
      const paymentDate = new Date(d.paymentDate);
      return d.status === 'Pago' && paymentDate.getUTCMonth() === currentMonth && paymentDate.getUTCFullYear() === currentYear;
    });

    const totalDonationsValue = donationsThisMonth.reduce((sum, d) => sum + d.amount, 0);

    const newDonorsThisMonth = donors.filter(d => {
      const joinDate = new Date(d.joinDate);
      return joinDate.getUTCMonth() === currentMonth && joinDate.getUTCFullYear() === currentYear;
    }).length;

    const pendingDonationsCount = donations.filter(d => d.status === 'Pendente').length;

    const collectionsTodayCount = donations.filter(d => {
      return d.status === 'Pago' &&
        d.paymentDate === todayString &&
        (d.paymentMethod === 'Coleta' || d.paymentMethod === 'Dinheiro');
    }).length;

    const kpiData = [
      { title: "Total de Doações", value: formatCurrency(totalDonationsValue), icon: DollarSign, description: `${donationsThisMonth.length} doações este mês` },
      { title: "Novos Doadores", value: `+${newDonorsThisMonth}`, icon: Users, description: newDonorsThisMonth > 0 ? `+${newDonorsThisMonth} este mês` : "Nenhum novo doador" },
      { title: "Doações Pendentes", value: String(pendingDonationsCount), icon: HandHeart, description: pendingDonationsCount > 0 ? `${pendingDonationsCount} doações pendentes` : "Nenhuma pendência" },
      { title: "Coletas Realizadas", value: String(collectionsTodayCount), icon: Bike, description: collectionsTodayCount > 0 ? `${collectionsTodayCount} coletas hoje` : "Nenhuma coleta hoje" },
    ];

    const advisorData = advisors
      .filter(a => a.status === 'Ativo')
      .map(advisor => {
        const total = donationsThisMonth
          .filter(d => d.assessor === advisor.name)
          .reduce((sum, d) => sum + d.amount, 0);
        return { name: advisor.name, total, photoUrl: advisor.photoUrl };
      });
    
    let topAdvisor = null;
    if (advisorData.length > 0) {
        const sortedAdvisors = [...advisorData].sort((a, b) => b.total - a.total);
        if (sortedAdvisors[0] && sortedAdvisors[0].total > 0) {
            topAdvisor = { name: sortedAdvisors[0].name, value: sortedAdvisors[0].total, photoUrl: sortedAdvisors[0].photoUrl };
        }
    }

    const messengerData = messengers
      .filter(m => m.status === 'Ativo')
      .map(messenger => {
        const collections = donationsThisMonth.filter(d => d.messenger === messenger.name).length;
        return { name: messenger.name, collections, photoUrl: messenger.photoUrl };
      });

    let topMessenger = null;
    if (messengerData.length > 0) {
        const sortedMessengers = [...messengerData].sort((a,b) => b.collections - a.collections);
        if (sortedMessengers[0] && sortedMessengers[0].collections > 0) {
            topMessenger = { name: sortedMessengers[0].name, value: sortedMessengers[0].collections, photoUrl: sortedMessengers[0].photoUrl };
        }
    }

    return {
      kpiData,
      advisorPerformanceData: advisorData.filter(item => item.total > 0),
      messengerPerformanceData: messengerData.filter(item => item.collections > 0),
      bestAdvisor: topAdvisor,
      bestMessenger: topMessenger
    }

  }, [donations, donors, advisors, messengers]);

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
                            <img src={bestAdvisor.photoUrl || "https://placehold.co/64x64.png"} alt="Avatar do melhor assessor" className="w-16 h-16 rounded-full object-cover" data-ai-hint="person trophy" />
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
                            <img src={bestMessenger.photoUrl || "https://placehold.co/64x64.png"} alt="Avatar do melhor mensageiro" className="w-16 h-16 rounded-full object-cover" data-ai-hint="person trophy" />
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
