'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
import type { Donor, Donation } from '@/lib/mock-data';
import type { VariantProps } from 'class-variance-authority';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const statusVariantMap: Record<Donor['status'], VariantProps<typeof badgeVariants>['variant']> = {
  Ativo: 'default',
  Inativo: 'secondary',
  Pendente: 'outline',
};

const donationStatusVariantMap: Record<Donation['status'], VariantProps<typeof badgeVariants>['variant']> = {
    Pago: 'default',
    Pendente: 'outline',
    Atrasado: 'destructive',
    Cancelado: 'secondary',
};

const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return 'R$ 0,00';
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

export function DonorsTable({ 
    data, 
    onEdit, 
    onDelete 
}: { 
    data: Donor[]; 
    onEdit: (donor: Donor) => void;
    onDelete: (donorId: string) => void;
}) {
  const [historyDonor, setHistoryDonor] = useState<Donor | null>(null);
  const [donationHistory, setDonationHistory] = useState<Donation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (historyDonor) {
        setLoadingHistory(true);
        const q = query(collection(db, 'donations'), where('donorCode', '==', historyDonor.code));
        const querySnapshot = await getDocs(q);
        const history: Donation[] = [];
        querySnapshot.forEach((doc) => {
          history.push({ id: doc.id, ...doc.data() } as Donation);
        });
        history.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        setDonationHistory(history);
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [historyDonor]);


  const handleDownload = (format: 'CSV' | 'PDF') => {
    if (!historyDonor || donationHistory.length === 0) return;

    if (format === 'PDF') {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Histórico de Doações: ${historyDonor.name}`, 14, 22);
      doc.setFontSize(11);
      doc.text(`Código do Doador: ${historyDonor.code}`, 14, 30);
      
      autoTable(doc, {
        startY: 40,
        head: [['Data de Vencimento', 'Status', 'Valor', 'Assessor', 'Mensageiro']],
        body: donationHistory.map(d => [
          formatDate(d.dueDate),
          d.status,
          formatCurrency(d.amount),
          d.assessor || '-',
          d.messenger || '-',
        ]),
        theme: 'striped',
      });
      doc.save(`historico_${historyDonor.name.replace(/\s/g, '_')}.pdf`);
    } else if (format === 'CSV') {
        const headers = ['DataVencimento', 'Status', 'Valor', 'Assessor', 'Mensageiro'];
        const rows = donationHistory.map(d => 
            [
                formatDate(d.dueDate),
                d.status,
                d.amount.toFixed(2).replace('.',','),
                `"${d.assessor || ''}"`,
                `"${d.messenger || ''}"`,
            ].join(',')
        );

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows].join('\n');
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `historico_${historyDonor.name.replace(/\s/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

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
                    <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(donor.id)}>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Doações: {historyDonor?.name}</DialogTitle>
            <DialogDescription>
              Veja abaixo o histórico completo de doações. Você pode baixar os dados em formato Excel ou PDF.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] rounded-md border">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">Carregando histórico...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationHistory.length > 0 ? (
                    donationHistory.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{formatDate(donation.dueDate)}</TableCell>
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
            )}
          </ScrollArea>
          <DialogFooter className="sm:justify-start gap-2 pt-4">
             <Button type="button" variant="outline" onClick={() => handleDownload('CSV')}>
              <Download className="mr-2 h-4 w-4" />
              Baixar em CSV (Excel)
            </Button>
            <Button type="button" variant="outline" onClick={() => handleDownload('PDF')}>
              <Download className="mr-2 h-4 w-4" />
              Baixar em PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
