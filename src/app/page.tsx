'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-lg border-0">
        <CardHeader className="items-center text-center p-6 space-y-4">
            <div className="p-3 bg-primary rounded-full text-primary-foreground">
                <LogIn className="h-6 w-6" />
            </div>
            <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Acessar Painel</CardTitle>
                <CardDescription>
                  Clique no botão abaixo para acessar o sistema
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Button onClick={handleLogin} className="w-full text-base font-semibold h-12 rounded-lg mt-2">
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
