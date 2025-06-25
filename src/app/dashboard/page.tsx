import { DollarSign, Percent, Users, Bike } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdvisorSalesChart, CommissionTrendChart, SalesDistributionChart } from '@/components/dashboard-charts';

const mockData = {
  summary: {
    totalSales: 45231.89,
    totalCommission: 3166.23,
    advisors: 12,
    messengers: 8,
  },
  advisorSales: [
    { name: 'Ana', total: 4000 },
    { name: 'Bruno', total: 3000 },
    { name: 'Carla', total: 2000 },
    { name: 'Daniel', total: 2780 },
    { name: 'Eduarda', total: 1890 },
    { name: 'Fábio', total: 2390 },
    { name: 'Gisele', total: 3490 },
  ],
  commissionTrends: [
    { month: 'Jan', commission: 400 },
    { month: 'Feb', commission: 300 },
    { month: 'Mar', commission: 500 },
    { month: 'Apr', commission: 280 },
    { month: 'May', commission: 450 },
    { month: 'Jun', commission: 320 },
  ],
  salesDistribution: [
    { name: 'Assessores', value: 35231.89, fill: 'hsl(var(--chart-1))' },
    { name: 'Mensageiros', value: 10000, fill: 'hsl(var(--chart-2))' },
  ],
  recentSales: [
    { id: 1, advisor: 'Ana Silva', messenger: 'João Pereira', amount: 250.0, status: 'Pago', date: '2023-10-26' },
    { id: 2, advisor: 'Bruno Costa', messenger: 'Maria Oliveira', amount: 150.0, status: 'Pendente', date: '2023-10-26' },
    { id: 3, advisor: 'Carla Dias', messenger: 'Pedro Santos', amount: 350.0, status: 'Pago', date: '2023-10-25' },
    { id: 4, advisor: 'Daniel Martins', messenger: 'Sofia Ferreira', amount: 450.0, status: 'Cancelado', date: '2023-10-24' },
    { id: 5, advisor: 'Eduarda Lima', messenger: 'Ricardo Alves', amount: 550.0, status: 'Pago', date: '2023-10-23' },
  ],
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockData.summary.totalSales.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockData.summary.totalCommission.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">+18.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advisors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockData.summary.advisors}</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messengers</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockData.summary.messengers}</div>
            <p className="text-xs text-muted-foreground">+1 since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Advisor Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <AdvisorSalesChart data={mockData.advisorSales} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Commission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <CommissionTrendChart data={mockData.commissionTrends} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advisor</TableHead>
                  <TableHead>Messenger</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.advisor}</TableCell>
                    <TableCell>{sale.messenger}</TableCell>
                    <TableCell className="text-right">R$ {sale.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={sale.status === 'Pago' ? 'default' : sale.status === 'Pendente' ? 'secondary' : 'destructive'} 
                             className={`${sale.status === 'Pago' && 'bg-accent text-accent-foreground'}
                                         ${sale.status === 'Pendente' && 'bg-yellow-500 text-white'}
                                         ${sale.status === 'Cancelado' && 'bg-red-500 text-white'}`}>
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesDistributionChart data={mockData.salesDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
