'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreHorizontal, Pencil, Trash2, History, Download } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';

type Donation = {
  date: string;
  amount: number;
  status: 'Pago' | 'Pendente' | 'Falhou';
};

type Donor = {
  id: string;
  code: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  assessor: string;
  amount: number;
  joinDate: string;
  history: Donation[];
};

const statusVariantMap: Record<Donor['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Ativo: 'default',
  Inativo: 'secondary',
  Pendente: 'outline',
};

const donationStatusVariantMap: Record<Donation['status'], VariantProps<typeof badgeVariants>['variant']> = {
    Pago: 'default',
    Pendente: 'outline',
    Falhou: 'destructive',
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

export function DonorsTable({ data, onEdit }: { data: any[]; onEdit: (donor: any) => void; }) {
  const [historyDonor, setHistoryDonor] = useState<Donor | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Assessor</TableHead>
            <TableHead className="hidden md:table-cell text-right">Última Doação</TableHead>
            <TableHead className="hidden sm:table-cell">Data de Cadastro</TableHead>
            <TableHead>
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((donor) => (
            <TableRow key={donor.id}>
              <TableCell className="font-mono text-sm text-muted-foreground">{donor.code}</TableCell>
              <TableCell>
                <div className="font-medium">{donor.name}</div>
                <div className="text-sm text-muted-foreground md:hidden">
                  {donor.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[donor.status]}>
                  {donor.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{donor.assessor}</TableCell>
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
                    <DropdownMenuItem onSelect={() => onEdit(donor)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setHistoryDonor(donor)}>
                      <History className="mr-2 h-4 w-4" />
                      Histórico de doações
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
      
      <Dialog open={!!historyDonor} onOpenChange={(isOpen) => !isOpen && setHistoryDonor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico de Doações: {historyDonor?.name}</DialogTitle>
            <DialogDescription>
              Veja abaixo o histórico completo de doações. Você pode baixar os dados em formato Excel ou PDF.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyDonor?.history && historyDonor.history.length > 0 ? (
                  historyDonor.history.map((donation, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(donation.date)}</TableCell>
                      <TableCell>
                        <Badge variant={donationStatusVariantMap[donation.status]}>
                            {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(donation.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Nenhuma doação encontrada.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          <DialogFooter className="sm:justify-start">
             <Button type="button" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar em Excel
            </Button>
            <Button type="button" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar em PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
