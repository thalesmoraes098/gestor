"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartConfigBar: ChartConfig = {
  total: {
    label: "Vendas",
    color: "hsl(var(--chart-1))",
  },
}

export function AdvisorSalesChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfigBar} className="h-[250px] w-full">
        <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}


const chartConfigLine: ChartConfig = {
  commission: {
    label: "Commission",
    color: "hsl(var(--chart-2))",
  },
}

export function CommissionTrendChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfigLine} className="h-[250px] w-full">
        <LineChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="commission" stroke="var(--color-commission)" strokeWidth={2} dot={false} />
        </LineChart>
    </ChartContainer>
  )
}

const messengerChartConfig: ChartConfig = {
  collections: {
    label: "Coletas",
    color: "hsl(var(--chart-2))",
  },
}

export function MessengerPerformanceChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={messengerChartConfig} className="h-[250px] w-full">
        <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="collections" fill="var(--color-collections)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}

const chartConfigPie: ChartConfig = {
  sales: {
    label: "Sales",
  },
}

export function SalesDistributionChart({ data }: { data: any[] }) {
    return (
        <ChartContainer config={chartConfigPie} className="h-[250px] w-full">
            <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </ChartContainer>
    )
}

const performanceReportChartConfig: ChartConfig = {
  Resultado: {
    label: "Resultado",
    color: "hsl(var(--chart-1))",
  },
  Meta: {
    label: "Meta",
    color: "hsl(var(--chart-4))",
  },
}

export function PerformanceReportChart({ data }: { data: any[] }) {
  return (
    <ChartContainer config={performanceReportChartConfig} className="h-[250px] w-full">
        <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="Resultado" fill="var(--color-Resultado)" radius={4} />
          <Bar dataKey="Meta" fill="var(--color-Meta)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}
