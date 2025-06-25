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

type Messenger = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Férias' | 'Licença Médica' | 'Suspensão' | 'Demitido';
};

const statusVariantMap: Record<Messenger['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Ativo: 'default',
  Férias: 'outline',
  'Licença Médica': 'secondary',
  Suspensão: 'destructive',
  Demitido: 'secondary',
};

export function MessengersTable({ data, onEdit }: { data: Messenger[]; onEdit: (messenger: Messenger) => void; }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">E-mail</TableHead>
          <TableHead className="hidden sm:table-cell">Telefone</TableHead>
          <TableHead>
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((messenger) => (
          <TableRow key={messenger.id}>
            <TableCell>
                <div className="font-medium">{messenger.name}</div>
                <div className="text-sm text-muted-foreground md:hidden">
                    {messenger.email}
                </div>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[messenger.status]}>
                {messenger.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{messenger.email}</TableCell>
            <TableCell className="hidden sm:table-cell">{messenger.phone}</TableCell>
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
                  <DropdownMenuItem onSelect={() => onEdit(messenger)}>
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
