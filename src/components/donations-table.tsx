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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

type Donation = {
  id: string;
  donorName: string;
  donorCode: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado';
  assessor: string;
  messenger: string;
  paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'PIX';
};

const statusVariantMap: Record<Donation['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Pago: 'default',
  Pendente: 'outline',
  Atrasado: 'destructive',
  Cancelado: 'secondary',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

export function DonationsTable({ data, onEdit }: { data: any[]; onEdit: (donation: any) => void; }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">ID Doação</TableHead>
          <TableHead>Doador</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Vencimento</TableHead>
          <TableHead className="hidden md:table-cell">Pagamento</TableHead>
          <TableHead className="hidden sm:table-cell">Assessor</TableHead>
          <TableHead className="hidden sm:table-cell">Mensageiro</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell className="font-mono text-sm text-muted-foreground">{donation.id}</TableCell>
            <TableCell>
              <div className="font-medium">{donation.donorName}</div>
              <div className="text-sm text-muted-foreground">
                Cód: {donation.donorCode}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[donation.status]}>
                {donation.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(donation.dueDate)}</TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(donation.paymentDate)}</TableCell>
            <TableCell className="hidden sm:table-cell">{donation.assessor}</TableCell>
            <TableCell className="hidden sm:table-cell">{donation.messenger}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(donation.amount)}</TableCell>
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
                  <DropdownMenuItem onSelect={() => onEdit(donation)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
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
