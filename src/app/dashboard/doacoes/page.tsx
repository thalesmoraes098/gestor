'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonationsTable } from "@/components/donations-table";
import { DonationsFilterDialog, type FilterFormValues } from "@/components/donations-filter-dialog";
import { AddDonationDialog } from "@/components/add-donation-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Donation } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DonorOption = { id: string; name: string; code: string; assessor?: string; };
type CollaboratorOption = { name: string };

export default function DoacoesPage() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [advisors, setAdvisors] = useState<CollaboratorOption[]>([]);
  const [messengers, setMessengers] = useState<CollaboratorOption[]>([]);
  const [donors, setDonors] = useState<DonorOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [donationToEdit, setDonationToEdit] = useState<Donation | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubDonations = onSnapshot(collection(db, "donations"), (snapshot) => {
        const data: Donation[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Donation));
        setDonations(data);
        setLoading(false);
    });

    const unsubAdvisors = onSnapshot(collection(db, "advisors"), (snapshot) => {
        const data: CollaboratorOption[] = [];
        snapshot.forEach((doc) => {
            if (doc.data().status === 'Ativo') {
                data.push({ name: doc.data().name });
            }
        });
        setAdvisors(data);
    });

    const unsubMessengers = onSnapshot(collection(db, "messengers"), (snapshot) => {
        const data: CollaboratorOption[] = [];
        snapshot.forEach((doc) => {
            if (doc.data().status === 'Ativo') {
                data.push({ name: doc.data().name });
            }
        });
        setMessengers(data);
    });

    const unsubDonors = onSnapshot(collection(db, "donors"), (snapshot) => {
        const data: DonorOption[] = [];
        snapshot.forEach((doc) => {
            const donorData = doc.data();
            data.push({ id: doc.id, name: donorData.name, code: donorData.code, assessor: donorData.assessor });
        });
        setDonors(data);
    });

    return () => {
        unsubDonations();
        unsubAdvisors();
        unsubMessengers();
        unsubDonors();
    };
  }, []);

  const filteredDonations = useMemo(() => {
    if (loading) return [];
    return donations.filter(donation => {
      let matches = true;
      if (filters.status && filters.status !== 'todos') {
        matches = matches && donation.status.toLowerCase() === filters.status;
      }
      if (filters.assessor && filters.assessor !== 'todos' && donation.assessor) {
        matches = matches && donation.assessor === filters.assessor;
      }
      if (filters.messenger && filters.messenger !== 'todos' && donation.messenger) {
        matches = matches && donation.messenger === filters.messenger;
      }
      if (filters.startDate) {
        const startDate = new Date(filters.startDate.setHours(0, 0, 0, 0));
        matches = matches && new Date(donation.dueDate) >= startDate;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate.setHours(23, 59, 59, 999));
        matches = matches && new Date(donation.dueDate) <= endDate;
      }
      if (filters.minAmount !== undefined) {
        matches = matches && donation.amount >= filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        matches = matches && donation.amount <= filters.maxAmount;
      }
      return matches;
    });
  }, [donations, filters, loading]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (donation: Donation) => {
    setDonationToEdit(donation);
    setIsDonationDialogOpen(true);
  };

  const handleAdd = () => {
    setDonationToEdit(null);
    setIsDonationDialogOpen(true);
  };

  const handleDelete = async (donationId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir esta doação?')) {
        try {
            await deleteDoc(doc(db, "donations", donationId));
            toast({
                title: 'Doação Excluída',
                description: 'A doação foi removida com sucesso.',
            });
        } catch (error) {
            console.error("Error deleting donation: ", error);
            toast({
              variant: "destructive",
              title: 'Erro ao Excluir',
              description: 'Não foi possível excluir a doação.',
            });
        }
    }
  };
  
  const handleSave = async (data: any) => {
    setIsDonationDialogOpen(false);
    const isEditing = !!data.id;

    try {
        if (isEditing) {
            const donationId = data.id!;
            const { id, ...dataToUpdate } = data;
            await updateDoc(doc(db, "donations", donationId), dataToUpdate);
            toast({ title: 'Doação Atualizada', description: 'Os dados da doação foram atualizados.' });
        } else {
            const { id, ...dataToCreate } = data;
            await addDoc(collection(db, "donations"), dataToCreate);
            toast({ title: 'Doação Adicionada', description: 'A nova doação foi registrada com sucesso.' });
        }

        if (data.donorId) {
            const donorRef = doc(db, "donors", data.donorId);
            const updates: { [key: string]: any } = {
                // Sempre atualiza o assessor do doador para o da última doação registrada
                assessor: data.assessor || ''
            };

            if (data.status === 'Pago') {
                updates.amount = data.amount; // Atualiza o valor da última doação
                updates.status = 'Ativo'; // Um doador que paga é considerado ativo
            }
            
            await updateDoc(donorRef, updates);
        }

    } catch (error) {
        console.error("Error saving donation: ", error);
        toast({
            variant: "destructive",
            title: 'Erro ao Salvar',
            description: 'Não foi possível salvar os dados da doação.',
        });
    }
  };

  const handleDialogChange = (open: boolean) => {
      setIsDonationDialogOpen(open);
      if (!open) {
          setDonationToEdit(null);
      }
  }

  return (
    <>
      <DonationsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} advisors={advisors} messengers={messengers} />
      <AddDonationDialog 
        open={isDonationDialogOpen} 
        onOpenChange={handleDialogChange} 
        donation={donationToEdit} 
        onSave={handleSave}
        donors={donors}
        advisors={advisors}
        messengers={messengers}
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doações</h1>
            <p className="text-muted-foreground">Gerencie as doações recebidas.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doação
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
             {loading ? (
              <div className="p-4">
                <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[120px]"><Skeleton className="h-5 w-full" /></TableHead>
                          <TableHead><Skeleton className="h-5 w-[150px]" /></TableHead>
                          <TableHead><Skeleton className="h-5 w-[80px]" /></TableHead>
                          <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-[100px]" /></TableHead>
                          <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-[100px]" /></TableHead>
                          <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-[100px]" /></TableHead>
                          <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-[100px]" /></TableHead>
                          <TableHead className="text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                          <TableHead><span className="sr-only">Ações</span></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {[...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                              <TableCell className="text-right"><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <DonationsTable data={filteredDonations} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
