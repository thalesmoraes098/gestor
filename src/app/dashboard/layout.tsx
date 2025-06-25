'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Bike,
  Briefcase,
  HandHeart,
  LayoutDashboard,
  Percent,
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

  const settingsMenuItem = { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings };

  const allNavigationItems = [...menuItems, settingsMenuItem];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Button variant="default" className="w-full font-bold" disabled>
            JUVENÓPOLIS
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
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === settingsMenuItem.href}
                  tooltip={settingsMenuItem.label}
                >
                  <Link href={settingsMenuItem.href}>
                    <settingsMenuItem.icon />
                    <span>{settingsMenuItem.label}</span>
                  </Link>
                </SidebarMenuButton>
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
                    {allNavigationItems.find(item => item.href === pathname)?.label ?? 'Dashboard'}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
