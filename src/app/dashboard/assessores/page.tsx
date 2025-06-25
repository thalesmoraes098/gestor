'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdvisorsTable } from "@/components/advisors-table";
import { AdvisorsFilterDialog, type FilterFormValues } from "@/components/advisors-filter-dialog";
import { AddAdvisorDialog } from "@/components/add-advisor-dialog";
import { ReallocateClientsDialog } from "@/components/reallocate-clients-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Advisor } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where, getDocs, writeBatch } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AssessoresPage() {
  const { toast } = useToast();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdvisorDialogOpen, setIsAdvisorDialogOpen] = useState(false);
  const [advisorToEdit, setAdvisorToEdit] = useState<Advisor | null>(null);
  const [isReallocationDialogOpen, setIsReallocationDialogOpen] = useState(false);
  const [dismissedAdvisor, setDismissedAdvisor] = useState<Advisor | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "advisors"), (querySnapshot) => {
      const advisorsData: Advisor[] = [];
      querySnapshot.forEach((doc) => {
        advisorsData.push({ id: doc.id, ...doc.data() } as Advisor);
      });
      setAdvisors(advisorsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const activeAdvisors = advisors.filter(
    (a) => a.status === 'Ativo' && a.id !== dismissedAdvisor?.id
  );

  const filteredAdvisors = useMemo(() => {
    if (loading) return [];
    return advisors.filter(advisor => {
      if (filters.status === 'todos') return true;
      return advisor.status.toLowerCase() === filters.status;
    });
  }, [advisors, filters, loading]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (advisor: Advisor) => {
    setAdvisorToEdit(advisor);
    setIsAdvisorDialogOpen(true);
  };

  const handleAdd = () => {
    setAdvisorToEdit(null);
    setIsAdvisorDialogOpen(true);
  };

  const handleSave = async (data: Omit<Advisor, 'id'> & { id?: string }) => {
    setIsAdvisorDialogOpen(false);
    const isEditing = !!data.id;

    try {
      let photoURL = data.photoUrl || (isEditing ? advisorToEdit?.photoUrl : '') || '';

      if (data.photoUrl && data.photoUrl.startsWith('data:image')) {
        const photoId = data.id || `advisor_${Date.now()}`;
        const storageRef = ref(storage, `advisor-photos/${photoId}`);
        const uploadResult = await uploadString(storageRef, data.photoUrl, 'data_url');
        photoURL = await getDownloadURL(uploadResult.ref);
      }
      
      const advisorData = { ...data, photoUrl: photoURL };

      if (isEditing) {
        const advisorId = data.id!;
        const { id, ...dataToUpdate } = advisorData;
        
        if (data.status === 'Demitido' && advisorToEdit?.status !== 'Demitido') {
          setDismissedAdvisor({ ...advisorToEdit, ...data, id: advisorId } as Advisor);
          setIsReallocationDialogOpen(true);
          // We only update the non-status fields, the final status update happens in reallocation
          const { status, ...otherUpdates } = dataToUpdate;
          await updateDoc(doc(db, "advisors", advisorId), otherUpdates);
          toast({ title: 'Assessor Atualizado', description: 'Reatribua a carteira de clientes.' });
        } else {
          await updateDoc(doc(db, "advisors", advisorId), dataToUpdate);
          toast({ title: 'Assessor Atualizado', description: 'Os dados do assessor foram atualizados.' });
        }
      } else {
        const { id, ...dataToCreate } = advisorData;
        await addDoc(collection(db, "advisors"), dataToCreate);
        toast({ title: 'Assessor Adicionado', description: 'O novo assessor foi registrado com sucesso.' });
      }
    } catch (error) {
        console.error("Error saving advisor: ", error);
        toast({
          variant: "destructive",
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar os dados do assessor.',
        });
    }
  };

  const handleReallocationConfirm = async (reallocationData: { option: string; specificAdvisorId?: string }) => {
    if (!dismissedAdvisor) return;

    const batch = writeBatch(db);

    try {
        const donorsQuery = query(collection(db, "donors"), where("assessor", "==", dismissedAdvisor.name));
        const donorsSnapshot = await getDocs(donorsQuery);

        if (!donorsSnapshot.empty) {
            if (reallocationData.option === 'company') {
                donorsSnapshot.forEach(donorDoc => {
                    batch.update(donorDoc.ref, { assessor: '' });
                });
            } else if (reallocationData.option === 'specific' && reallocationData.specificAdvisorId) {
                const newAdvisor = activeAdvisors.find(a => a.id === reallocationData.specificAdvisorId);
                if (newAdvisor) {
                    donorsSnapshot.forEach(donorDoc => {
                        batch.update(donorDoc.ref, { assessor: newAdvisor.name });
                    });
                }
            } else if (reallocationData.option === 'automatic') {
                const availableAdvisors = activeAdvisors.filter(a => a.id !== dismissedAdvisor.id);
                if (availableAdvisors.length > 0) {
                    let advisorIndex = 0;
                    donorsSnapshot.forEach(donorDoc => {
                        const newAdvisor = availableAdvisors[advisorIndex % availableAdvisors.length];
                        batch.update(donorDoc.ref, { assessor: newAdvisor.name });
                        advisorIndex++;
                    });
                }
            }
        }
        
        const advisorRef = doc(db, "advisors", dismissedAdvisor.id);
        batch.update(advisorRef, { status: 'Demitido' });

        await batch.commit();

        toast({ title: 'Operação Concluída', description: `O assessor ${dismissedAdvisor.name} foi demitido e a carteira de clientes foi reatribuída com sucesso.` });

    } catch (error) {
        console.error("Error reallocating clients: ", error);
        toast({
            variant: "destructive",
            title: 'Erro na Reatribuição',
            description: 'Não foi possível reatribuir a carteira de clientes.',
        });
    }

    setIsReallocationDialogOpen(false);
    setDismissedAdvisor(null);
  };

  const handleDialogChange = (open: boolean) => {
      setIsAdvisorDialogOpen(open);
      if (!open) {
          setAdvisorToEdit(null);
      }
  }

  return (
    <>
      <AdvisorsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} />
      <AddAdvisorDialog 
        open={isAdvisorDialogOpen} 
        onOpenChange={handleDialogChange} 
        advisor={advisorToEdit} 
        onSave={handleSave}
      />
      <ReallocateClientsDialog
        open={isReallocationDialogOpen}
        onOpenChange={setIsReallocationDialogOpen}
        dismissedAdvisor={dismissedAdvisor}
        activeAdvisors={activeAdvisors}
        onConfirm={handleReallocationConfirm}
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Assessores</h1>
            <p className="text-muted-foreground">Gerencie os assessores da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Assessor
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
                      <TableHead><Skeleton className="h-5 w-[150px]" /></TableHead>
                      <TableHead><Skeleton className="h-5 w-[80px]" /></TableHead>
                      <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-[200px]" /></TableHead>
                      <TableHead className="text-right"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                      <TableHead className="text-right hidden lg:table-cell"><Skeleton className="h-5 w-[100px] ml-auto" /></TableHead>
                      <TableHead className="text-right"><Skeleton className="h-5 w-[120px] ml-auto" /></TableHead>
                      <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <AdvisorsTable data={filteredAdvisors} onEdit={handleEdit} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
