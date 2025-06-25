'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/session';
import { setLoggedInUser } from '@/lib/session';

// Mock user database for login simulation
const users: (User & { password: string })[] = [
    { id: 'user-admin', name: 'Admin', email: 'admin@email.com', role: 'Admin', password: 'password' },
    { id: 'user-1', name: 'Usuário Padrão', email: 'user@email.com', role: 'Usuário', password: 'password' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
      // Exclude password from the stored user object
      const { password: _, ...userToStore } = foundUser;
      setLoggedInUser(userToStore);
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: 'E-mail ou senha incorretos.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-lg border-0">
        <CardHeader className="items-center text-center p-6 space-y-4">
            <div className="p-3 bg-primary rounded-full text-primary-foreground">
                <LogIn className="h-6 w-6" />
            </div>
            <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@email.com" 
                required 
                className="bg-primary/10 border-0 focus-visible:ring-primary rounded-lg h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password" className="font-medium">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="bg-primary/10 border-0 focus-visible:ring-primary rounded-lg h-12 text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full text-base font-semibold h-12 rounded-lg mt-2">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
