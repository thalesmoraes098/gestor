import Link from 'next/link';
import {
  Bell,
  LayoutGrid,
  Users,
  HandHeart,
  Briefcase,
  Bike,
  Percent,
  BarChart,
  Settings,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-sidebar">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
              <svg
                className="h-6 w-6"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.448 37.3333C16.904 37.3333 16.424 37.12 16.096 36.72L3.296 21.0133C2.128 19.52 1.84 17.5 2.56 15.6933C3.28 13.8867 4.896 12.6667 6.8 12.6667H14.8V5.33333C14.8 3.96 15.544 2.77333 16.672 2.13333C17.8 1.49333 19.144 1.52 20.224 2.21333L36.376 13.5467C37.312 14.1333 37.936 15.1067 38.072 16.2C38.208 17.2933 37.84 18.3867 37.048 19.1467L20.848 36.6933C20.448 37.1333 19.896 37.3333 19.336 37.3333H17.448Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              JUVENÓPOLIS
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/dashboard">
                  <LayoutGrid />
                  Painel
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
           <SidebarMenu className="px-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Users />
                  Doadores
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <HandHeart />
                  Doações
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Briefcase />
                  Assessores
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Bike />
                  Mensageiros
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <Percent />
                  Comissões
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#">
                  <BarChart />
                  Relatórios
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu className="px-4">
             <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                      <Settings />
                      Configurações
                  </Link>
                </SidebarMenuButton>
             </SidebarMenuItem>
             <SidebarSeparator />
             <SidebarMenuItem>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <button className="flex items-center gap-3 w-full p-2 text-sm font-medium text-sidebar-foreground rounded-md hover:bg-sidebar-accent">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="male avatar" />
                              <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <span className="group-data-[collapsible=icon]:hidden">Admin</span>
                         </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Configurações</DropdownMenuItem>
                      <DropdownMenuItem>Suporte</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login">Sair</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
                <SidebarTrigger className="flex md:hidden" />
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                  <Button variant="outline">Convidar pessoas</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notificações</span>
                  </button>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
