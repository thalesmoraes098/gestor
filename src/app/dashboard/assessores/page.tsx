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
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

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

  const handleDelete = async (advisorId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este assessor? Esta ação não pode ser desfeita.')) {
      try {
        await deleteDoc(doc(db, "advisors", advisorId));
        toast({
          title: 'Assessor Excluído',
          description: 'O assessor foi removido com sucesso.',
        });
      } catch (error) {
        console.error("Error deleting advisor: ", error);
        toast({
          variant: "destructive",
          title: 'Erro ao Excluir',
          description: 'Não foi possível excluir o assessor.',
        });
      }
    }
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

  const handleReallocationConfirm = async (reallocationData: any) => {
      console.log('Reallocation Confirmed:', reallocationData);
      if (dismissedAdvisor) {
        try {
          const advisorRef = doc(db, "advisors", dismissedAdvisor.id);
          await updateDoc(advisorRef, { status: 'Demitido' });
          toast({ title: 'Assessor Demitido', description: `O assessor ${dismissedAdvisor.name} foi demitido e a carteira reatribuída.` });
        } catch (error) {
          console.error("Error updating advisor status to dismissed: ", error);
          toast({
            variant: "destructive",
            title: 'Erro ao demitir',
            description: 'Não foi possível atualizar o status do assessor.',
          });
        }
      }
      setIsReallocationDialogOpen(false);
      setDismissedAdvisor(null);
  }

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
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando assessores...</p>
              </div>
            ) : (
              <AdvisorsTable data={filteredAdvisors} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
