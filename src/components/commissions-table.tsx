'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

type Commission = {
  id: string;
  referenceMonth: string;
  recipientName: string;
  recipientType: 'Assessor' | 'Mensageiro';
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'Paga' | 'Pendente';
  paymentDate?: string;
};

const statusVariantMap: Record<Commission['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Paga: 'default',
  Pendente: 'outline',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

export function CommissionsTable({ data, onEdit }: { data: Commission[]; onEdit: (commission: Commission) => void; }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mês/Ano</TableHead>
          <TableHead>Beneficiário</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell text-right">Valor Base</TableHead>
          <TableHead className="hidden sm:table-cell text-right">Taxa (%)</TableHead>
          <TableHead className="text-right">Comissão</TableHead>
          <TableHead className="hidden sm:table-cell text-center">Data Pag.</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((commission) => (
          <TableRow key={commission.id}>
            <TableCell>
              <div className="font-medium">{commission.referenceMonth}</div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{commission.recipientName}</div>
              <div className="text-sm text-muted-foreground">
                {commission.recipientType}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[commission.status]}>
                {commission.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell text-right">{formatCurrency(commission.baseAmount)}</TableCell>
            <TableCell className="hidden sm:table-cell text-right">{commission.commissionRate.toFixed(1)}%</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(commission.commissionAmount)}</TableCell>
            <TableCell className="hidden sm:table-cell text-center">{formatDate(commission.paymentDate)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => onEdit(commission)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver/Editar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
