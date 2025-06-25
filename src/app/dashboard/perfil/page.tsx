'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';

export default function PerfilPage() {
  const form = useForm({
    defaultValues: {
      name: 'Usuário',
      email: 'usuario@email.com',
      photoUrl: '',
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">Atualize suas informações pessoais e foto.</p>
      </div>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Card className="rounded-2xl border-0 shadow-lg max-w-2xl mt-4">
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                A funcionalidade de autenticação foi removida. Esta página é apenas para visualização.
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
                                <AvatarImage src={field.value || 'https://placehold.co/80x80.png'} alt={'Usuário'} data-ai-hint="person" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <FormLabel>Foto de Perfil</FormLabel>
                                <FormControl>
                                  <label htmlFor="photo-upload-profile" className="w-full cursor-not-allowed">
                                      <div className="w-full h-10 px-4 py-2 bg-muted text-muted-foreground rounded-lg flex items-center justify-center text-sm font-semibold transition-colors">
                                          Escolher arquivo
                                      </div>
                                      <Input 
                                          id="photo-upload-profile"
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
                                          disabled
                                      />
                                  </label>
                                </FormControl>
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
                      <Input placeholder="Seu nome completo" {...field} disabled />
                    </FormControl>
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
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
