'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DonorsTable } from "@/components/donors-table";
import { DonorsFilterDialog, type FilterFormValues } from "@/components/donors-filter-dialog";
import { AddDonorDialog } from "@/components/add-donor-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Donor, Advisor } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DoadoresPage() {
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [advisors, setAdvisors] = useState<Pick<Advisor, 'id' | 'name'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false);
  const [donorToEdit, setDonorToEdit] = useState<Donor | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribeDonors = onSnapshot(collection(db, "donors"), (querySnapshot) => {
      const donorsData: Donor[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        donorsData.push({ 
          id: doc.id, 
          ...data,
          history: data.history || [],
          phones: data.phones || [],
          addresses: data.addresses || [],
        } as Donor);
      });
      setDonors(donorsData);
      setLoading(false);
    });
    
    const unsubscribeAdvisors = onSnapshot(collection(db, "advisors"), (querySnapshot) => {
      const advisorsData: Pick<Advisor, 'id' | 'name'>[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().status === 'Ativo') {
          advisorsData.push({ id: doc.id, name: doc.data().name });
        }
      });
      setAdvisors(advisorsData);
    });

    return () => {
      unsubscribeDonors();
      unsubscribeAdvisors();
    };
  }, []);

  const advisorNames = useMemo(() => advisors.map(a => a.name), [advisors]);

  const filteredDonors = useMemo(() => {
    if (loading) return [];
    return donors.filter(donor => {
      let matches = true;
      if (filters.status && filters.status !== 'todos') {
        matches = matches && donor.status.toLowerCase() === filters.status;
      }
      if (filters.assessor && filters.assessor !== 'todos' && donor.assessor) {
        matches = matches && donor.assessor === filters.assessor;
      }
       if (filters.startDate) {
        const startDate = new Date(filters.startDate.setHours(0, 0, 0, 0));
        matches = matches && new Date(donor.joinDate) >= startDate;
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate.setHours(23, 59, 59, 999));
        matches = matches && new Date(donor.joinDate) <= endDate;
      }
      if (filters.minAmount !== undefined) {
        matches = matches && donor.amount >= filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        matches = matches && donor.amount <= filters.maxAmount;
      }
      return matches;
    });
  }, [donors, filters, loading]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (donor: Donor) => {
    setDonorToEdit(donor);
    setIsDonorDialogOpen(true);
  };

  const handleAdd = () => {
    setDonorToEdit(null);
    setIsDonorDialogOpen(true);
  };

  const handleDelete = async (donorId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este doador? Todos os dados associados serão perdidos permanentemente.')) {
        try {
            await deleteDoc(doc(db, "donors", donorId));
            toast({
                title: 'Doador Excluído',
                description: 'O doador foi removido com sucesso.',
            });
        } catch (error) {
            console.error("Error deleting donor: ", error);
            toast({
              variant: "destructive",
              title: 'Erro ao Excluir',
              description: 'Não foi possível excluir o doador.',
            });
        }
    }
  };

  const handleSave = async (data: Omit<Donor, 'id' | 'history' | 'amount'> & { id?: string }) => {
    setIsDonorDialogOpen(false);
    const isEditing = !!data.id;

    try {
      if (isEditing) {
          const donorId = data.id!;
          const { id, ...dataToUpdate } = data;
          await updateDoc(doc(db, "donors", donorId), dataToUpdate);
          toast({ title: 'Doador Atualizado', description: 'Os dados do doador foram atualizados.' });
      } else {
          const newDonorData = { 
              ...data,
              amount: 0,
              joinDate: new Date().toISOString().split('T')[0],
              history: [],
          };
          const { id, ...dataToCreate } = newDonorData as any;
          await addDoc(collection(db, "donors"), dataToCreate);
          toast({ title: 'Doador Adicionado', description: 'O novo doador foi registrado com sucesso.' });
      }
    } catch (error) {
        console.error("Error saving donor: ", error);
        toast({
          variant: "destructive",
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar os dados do doador.',
        });
    }
  };

  const handleDialogChange = (open: boolean) => {
      setIsDonorDialogOpen(open);
      if (!open) {
          setDonorToEdit(null);
      }
  }

  return (
    <>
      <DonorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} advisorNames={advisorNames} />
      <AddDonorDialog open={isDonorDialogOpen} onOpenChange={handleDialogChange} donor={donorToEdit} onSave={handleSave} advisorNames={advisorNames} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doadores</h1>
            <p className="text-muted-foreground">Gerencie os doadores da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Doador
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
                            <TableHead className="hidden md:table-cell text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                            <TableHead className="hidden sm:table-cell"><Skeleton className="h-5 w-[100px]" /></TableHead>
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
                                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                                <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            ) : (
              <DonorsTable data={filteredDonors} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
