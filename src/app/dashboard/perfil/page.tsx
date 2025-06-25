'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const profileSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  photoUrl: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      photoUrl: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch additional data from Firestore if needed
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            form.reset({
                name: currentUser.displayName || userData.name,
                email: currentUser.email || '',
                photoUrl: currentUser.photoURL || userData.photoUrl || '',
            });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [form, router]);


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Nenhum usuário autenticado.' });
        return;
    }

    try {
        let photoURL = user.photoURL || '';

        // Check if a new photo was uploaded
        if (data.photoUrl && data.photoUrl.startsWith('data:image')) {
            const storageRef = ref(storage, `profile-photos/${user.uid}`);
            const uploadTask = await uploadString(storageRef, data.photoUrl, 'data_url');
            photoURL = await getDownloadURL(uploadTask.ref);
        }

        // Update Firebase Auth profile
        await updateProfile(user, {
            displayName: data.name,
            photoURL: photoURL,
        });

        // Update Firestore document
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            name: data.name,
            email: data.email, // Note: updating email in Firestore, not in Auth for simplicity
            photoUrl: photoURL,
        });

        toast({
            title: 'Perfil Atualizado',
            description: 'Suas informações foram salvas com sucesso.',
        });
        router.refresh(); // Refresh to show updated info in layout
    } catch (error) {
        console.error("Error updating profile:", error);
        toast({
            variant: 'destructive',
            title: 'Erro ao atualizar perfil',
            description: 'Não foi possível salvar as alterações.',
        });
    }
  };

  if (loading) {
      return <div className="text-center p-10">Carregando perfil...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Atualize suas informações pessoais e foto.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="rounded-2xl border-0 shadow-lg max-w-2xl mt-4">
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Mantenha seus dados de contato e nome atualizados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={field.value || 'https://placehold.co/80x80.png'} alt={user?.displayName || 'User'} data-ai-hint="person" />
                                <AvatarFallback>{user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <FormLabel>Foto de Perfil</FormLabel>
                                <FormControl>
                                  <label htmlFor="photo-upload-profile" className="w-full cursor-pointer">
                                      <div className="w-full h-10 px-4 py-2 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-semibold hover:bg-primary/20 transition-colors">
                                          Escolher arquivo
                                      </div>
                                      <Input 
                                          id="photo-upload-profile"
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
                                          onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                              const file = e.target.files[0];
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                              field.onChange(reader.result as string);
                                              };
                                              reader.readAsDataURL(file);
                                          }
                                          }}
                                      />
                                  </label>
                                </FormControl>
                                <FormMessage />
                            </div>
                        </div>
                    </FormItem>
                    )}
                />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
