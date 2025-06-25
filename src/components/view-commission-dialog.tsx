'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Commission } from '@/lib/mock-data';

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function ViewCommissionDialog({ 
  open, 
  onOpenChange, 
  commission,
  onMarkAsPaid,
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  commission?: Commission | null;
  onMarkAsPaid: (commissionId: string) => void;
}) {
  const handleCancel = () => {
    onOpenChange(false);
  }

  if (!commission) return null;
  
  const isAssessor = commission.recipientType === 'Assessor';
  const goalMet = isAssessor && commission.goal && commission.baseAmount >= commission.goal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Comissão</DialogTitle>
          <DialogDescription>
            Resumo detalhado da comissão calculada para o período.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 p-1">
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Beneficiário:</span>
                <span className="font-semibold text-right">{commission.recipientName} ({commission.recipientType})</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Mês de Referência:</span>
                <span className="font-semibold text-right">{commission.referenceMonth}</span>
              </div>
              
              {isAssessor ? (
                <>
                    <div className="grid grid-cols-2 gap-2 border-t pt-2 mt-2">
                        <span className="text-muted-foreground">Meta (Arrecadação):</span>
                        <span className="font-semibold text-right">{formatCurrency(commission.goal)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Resultado (Arrecadação):</span>
                        <span className={`font-semibold text-right`}>
                            {formatCurrency(commission.baseAmount)}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Comissão (Min/Máx):</span>
                        <span className="font-semibold text-right">{commission.minCommissionPercentage?.toFixed(1)}% / {commission.maxCommissionPercentage?.toFixed(1)}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Taxa Aplicada:</span>
                        <span className="font-semibold text-right flex items-center justify-end gap-2">
                            {commission.commissionRate.toFixed(1)}%
                            <Badge variant={goalMet ? 'default' : 'destructive'}>{goalMet ? 'Máxima' : 'Mínima'}</Badge>
                        </span>
                    </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 border-t pt-2 mt-2">
                  <span className="text-muted-foreground">Total Coletado:</span>
                  <span className="font-semibold text-right">{formatCurrency(commission.baseAmount)}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 border-t pt-2 mt-2">
                <span className="text-muted-foreground">Status da Comissão:</span>
                <span className="font-semibold text-right"><Badge variant={commission.status === 'Paga' ? 'default' : 'outline'}>{commission.status}</Badge></span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Valor da Comissão:</span>
                <span className="font-semibold text-right text-lg text-primary">{formatCurrency(commission.commissionAmount)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 sm:justify-between">
          <Button type="button" variant="outline" onClick={handleCancel}>Fechar</Button>
          {commission.status !== 'Paga' && (
              <Button type="button" onClick={() => onMarkAsPaid(commission.id)}>Marcar como Paga</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
