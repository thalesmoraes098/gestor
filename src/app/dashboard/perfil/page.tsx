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
import { getLoggedInUser, setLoggedInUser, type User } from '@/lib/session';

const profileSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  photoUrl: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      photoUrl: '',
    },
  });

  useEffect(() => {
    const currentUser = getLoggedInUser();
    setUser(currentUser);
    if (currentUser) {
      form.reset({
        name: currentUser.name,
        email: currentUser.email,
        photoUrl: currentUser.photoUrl || '',
      });
    }
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setLoggedInUser(updatedUser);
      setUser(updatedUser); // Update local state to reflect changes immediately
      toast({
        title: 'Perfil Atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
      // Force a reload of the layout by navigating
      router.refresh();
    }
  };

  const photoUrl = form.watch('photoUrl');

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
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={photoUrl || 'https://placehold.co/80x80.png'} alt={user?.name || 'User'} data-ai-hint="person" />
                        <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <FormField
                        control={form.control}
                        name="photoUrl"
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>URL da Foto</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/sua-foto.png" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
              </div>

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
                      <Input type="email" placeholder="seu@email.com" {...field} />
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
