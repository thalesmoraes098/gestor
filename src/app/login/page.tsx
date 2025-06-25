'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      let errorMessage = 'E-mail ou senha incorretos.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Credenciais inválidas. Por favor, verifique seu e-mail e senha.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'O formato do e-mail ou senha é inválido.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full text-base font-semibold h-12 rounded-lg mt-2" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
