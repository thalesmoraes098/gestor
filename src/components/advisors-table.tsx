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
import { MoreHorizontal, Pencil } from 'lucide-react';
import type { Advisor } from '@/lib/mock-data';
import type { VariantProps } from 'class-variance-authority';

const statusVariantMap: Record<Advisor['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Ativo: 'default',
  Férias: 'outline',
  'Licença Médica': 'secondary',
  Suspensão: 'destructive',
  Demitido: 'secondary',
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

export function AdvisorsTable({ 
    data, 
    onEdit,
}: { 
    data: Advisor[]; 
    onEdit: (advisor: Advisor) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">E-mail</TableHead>
          <TableHead className="text-right">Meta (R$)</TableHead>
          <TableHead className="text-right hidden lg:table-cell">Meta (Clientes)</TableHead>
          <TableHead className="text-right">Comissão (Min/Máx %)</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((advisor) => (
          <TableRow key={advisor.id}>
            <TableCell>
                <div className="font-medium">{advisor.name}</div>
                <div className="text-sm text-muted-foreground md:hidden">
                    {advisor.email}
                </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[advisor.status]}>
                {advisor.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{advisor.email}</TableCell>
            <TableCell className="text-right font-medium">{formatCurrency(advisor.goal)}</TableCell>
            <TableCell className="text-right font-medium hidden lg:table-cell">{advisor.newClientsGoal}</TableCell>
            <TableCell className="text-right font-medium">{`${advisor.minCommissionPercentage.toFixed(1)}% / ${advisor.maxCommissionPercentage.toFixed(1)}%`}</TableCell>
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
                  <DropdownMenuItem onSelect={() => onEdit(advisor)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
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
