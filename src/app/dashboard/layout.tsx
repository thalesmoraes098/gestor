'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart,
  Bike,
  Briefcase,
  HandHeart,
  LayoutDashboard,
  Percent,
  Settings,
  Users,
  User as UserIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getLoggedInUser, setLoggedInUser, type User } from '@/lib/session';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setUser(getLoggedInUser());
  }, [pathname]);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/doadores', label: 'Doadores', icon: Users },
    { href: '/dashboard/doacoes', label: 'Doações', icon: HandHeart },
    { href: '/dashboard/assessores', label: 'Assessores', icon: Briefcase },
    { href: '/dashboard/mensageiros', label: 'Mensageiros', icon: Bike },
    { href: '/dashboard/comissoes', label: 'Comissões', icon: Percent },
    { href: '/dashboard/relatorios', label: 'Relatórios', icon: BarChart },
  ];
  
  const handleLogout = () => {
    setLoggedInUser(null);
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Button asChild variant="ghost" className="w-full justify-center text-lg font-bold text-primary bg-primary/10 hover:bg-primary/20">
            <Link href="/dashboard">GESTOR DIGITAL</Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger className="flex md:hidden"/>
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoUrl || 'https://placehold.co/40x40.png'} alt={user?.name || 'User'} data-ai-hint="person" />
                    <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/perfil">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                    </Link>
                </DropdownMenuItem>
                {user?.role === 'Admin' && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/configuracoes">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <footer className="p-4 text-center text-sm text-muted-foreground border-t">
          2025 TODOS OS DIREITOS RESERVADOS. DESENVOLVIDO POR <a href="https://wa.me/5582996595164" target="_blank" rel="noopener noreferrer" className="font-bold">VTEX DIGITAL</a>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
