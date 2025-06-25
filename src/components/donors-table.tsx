'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { badgeVariants } from '@/components/ui/badge';

type Donor = {
  id: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  amount: number;
  joinDate: string;
};

const statusVariantMap: Record<Donor['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Ativo: 'default',
  Inativo: 'secondary',
  Pendente: 'outline',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export function DonorsTable({ data }: { data: Donor[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell text-right">Doação Mensal</TableHead>
          <TableHead className="hidden sm:table-cell">Data de Cadastro</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((donor) => (
          <TableRow key={donor.id}>
            <TableCell>
              <div className="font-medium">{donor.name}</div>
              <div className="text-sm text-muted-foreground md:hidden">
                {donor.email}
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant={statusVariantMap[donor.status]}>
                {donor.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell text-right">
              {formatCurrency(donor.amount)}
            </TableCell>
            <TableCell className="hidden sm:table-cell">{formatDate(donor.joinDate)}</TableCell>
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
                  <DropdownMenuItem>
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
