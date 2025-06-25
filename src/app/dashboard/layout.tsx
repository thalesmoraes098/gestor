'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Bike,
  Briefcase,
  Gift,
  HandHeart,
  LayoutDashboard,
  Percent,
  Plus,
  Settings,
  Users,
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/doadores', label: 'Doadores', icon: Users },
    { href: '/dashboard/doacoes', label: 'Doações', icon: HandHeart },
    { href: '/dashboard/assessores', label: 'Assessores', icon: Briefcase },
    { href: '/dashboard/mensageiros', label: 'Mensageiros', icon: Bike },
    { href: '/dashboard/comissoes', label: 'Comissões', icon: Percent },
    { href: '/dashboard/relatorios', label: 'Relatórios', icon: BarChart },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Button variant="default" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <Link href="/dashboard/configuracoes" legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/dashboard/configuracoes'}
                    tooltip="Configurações"
                  >
                    <a>
                      <Settings />
                      <span>Configurações</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Perfil">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" data-ai-hint="person" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span>Admin</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger className="flex md:hidden"/>
            <div className='flex-1'>
                 <h1 className="text-lg font-semibold md:text-xl">
                    {menuItems.find(item => item.href === pathname)?.label || 'Configurações' || 'Dashboard'}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
