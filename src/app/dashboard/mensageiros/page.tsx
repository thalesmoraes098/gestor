'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessengersTable } from "@/components/messengers-table";
import { MessengersFilterDialog, type FilterFormValues } from "@/components/messengers-filter-dialog";
import { AddMessengerDialog } from "@/components/add-messenger-dialog";
import { Filter, PlusCircle } from "lucide-react";
import type { Messenger } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function MensageirosPage() {
  const { toast } = useToast();
  const [messengers, setMessengers] = useState<Messenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterFormValues>({ status: 'todos' });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMessengerDialogOpen, setIsMessengerDialogOpen] = useState(false);
  const [messengerToEdit, setMessengerToEdit] = useState<Messenger | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "messengers"), (querySnapshot) => {
      const messengersData: Messenger[] = [];
      querySnapshot.forEach((doc) => {
        messengersData.push({ id: doc.id, ...doc.data() } as Messenger);
      });
      setMessengers(messengersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMessengers = useMemo(() => {
    if (loading) return [];
    return messengers.filter(messenger => {
      if (filters.status === 'todos') return true;
      return messenger.status.toLowerCase() === filters.status;
    });
  }, [messengers, filters, loading]);

  const handleApplyFilters = (newFilters: FilterFormValues) => {
    setFilters(newFilters);
  };

  const handleEdit = (messenger: Messenger) => {
    setMessengerToEdit(messenger);
    setIsMessengerDialogOpen(true);
  };

  const handleAdd = () => {
    setMessengerToEdit(null);
    setIsMessengerDialogOpen(true);
  };

  const handleDelete = async (messengerId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este mensageiro?')) {
      try {
        await deleteDoc(doc(db, "messengers", messengerId));
        toast({
          title: 'Mensageiro Excluído',
          description: 'O mensageiro foi removido com sucesso.',
        });
      } catch (error) {
        console.error("Error deleting messenger: ", error);
        toast({
          variant: "destructive",
          title: 'Erro ao Excluir',
          description: 'Não foi possível excluir o mensageiro.',
        });
      }
    }
  };
  
  const handleSave = async (data: Omit<Messenger, 'id'> & { id?: string }) => {
    setIsMessengerDialogOpen(false);
    const isEditing = !!data.id;

    try {
      let photoURL = data.photoUrl || (isEditing ? messengerToEdit?.photoUrl : '') || '';

      if (data.photoUrl && data.photoUrl.startsWith('data:image')) {
        const photoId = data.id || `messenger_${Date.now()}`;
        const storageRef = ref(storage, `messenger-photos/${photoId}`);
        const uploadResult = await uploadString(storageRef, data.photoUrl, 'data_url');
        photoURL = await getDownloadURL(uploadResult.ref);
      }
      
      const messengerData: any = { ...data, photoUrl: photoURL };

      if (!messengerData.receivesCommission) {
        messengerData.commissionPercentage = undefined;
      }

      if (isEditing) {
        const messengerId = data.id!;
        const { id, ...dataToUpdate } = messengerData;
        await updateDoc(doc(db, "messengers", messengerId), dataToUpdate);
        toast({ title: 'Mensageiro Atualizado', description: 'Os dados do mensageiro foram atualizados.' });
      } else {
        const { id, ...dataToCreate } = messengerData;
        await addDoc(collection(db, "messengers"), dataToCreate);
        toast({ title: 'Mensageiro Adicionado', description: 'O novo mensageiro foi registrado com sucesso.' });
      }
    } catch (error) {
        console.error("Error saving messenger: ", error);
        toast({
          variant: "destructive",
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar os dados do mensageiro.',
        });
    }
  };

  const handleDialogChange = (open: boolean) => {
      setIsMessengerDialogOpen(open);
      if (!open) {
          setMessengerToEdit(null);
      }
  }

  return (
    <>
      <MessengersFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleApplyFilters} />
      <AddMessengerDialog 
        open={isMessengerDialogOpen} 
        onOpenChange={handleDialogChange} 
        messenger={messengerToEdit} 
        onSave={handleSave}
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mensageiros</h1>
            <p className="text-muted-foreground">Gerencie os mensageiros da sua organização.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-12 rounded-lg text-base" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-5 w-5" />
              Filtros
            </Button>
            <Button className="h-12 rounded-lg font-semibold text-base" onClick={handleAdd}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Mensageiro
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Carregando mensageiros...</p>
              </div>
            ) : (
              <MessengersTable data={filteredMessengers} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
