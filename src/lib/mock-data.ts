'use client';

// Types
export type Advisor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  minCommissionPercentage: number;
  maxCommissionPercentage: number;
  goal: number;
  newClientsGoal: number;
  status: 'Ativo' | 'Férias' | 'Licença Médica' | 'Suspensão' | 'Demitido';
};

export type Messenger = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  status: 'Ativo' | 'Férias' | 'Licença Médica' | 'Suspensão' | 'Demitido';
  receivesCommission?: boolean;
  commissionPercentage?: number;
};

export type Donor = {
  id: string;
  code: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  assessor: string;
  amount: number;
  joinDate: string;
  isLoyal: boolean;
  paymentDay?: string;
  phones?: { value: string }[];
  addresses?: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    reference: string;
  }[];
  history: { 
    date: string;
    amount: number;
    status: 'Pago' | 'Pendente' | 'Falhou' | 'Atrasado' | 'Cancelado';
  }[];
};

export type Donation = {
  id: string;
  donorName: string;
  donorCode: string;
  amount: number;
  paymentDate?: string;
  dueDate: string;
  status: 'Pago' | 'Pendente' | 'Atrasado' | 'Cancelado';
  assessor: string;
  messenger: string;
  paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'PIX' | 'Transferência Bancária' | 'Coleta';
};

export type Commission = {
  id: string;
  referenceMonth: string;
  recipientName: string;
  recipientId: string;
  recipientType: 'Assessor' | 'Mensageiro';
  goal?: number;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'Paga' | 'Pendente';
  paymentDate?: string;
  newClientsGoal?: number;
  newClientsResult?: number;
  minCommissionPercentage?: number;
  maxCommissionPercentage?: number;
};

// Mock Data
export const advisors: Advisor[] = [
  { id: 'adv1', name: 'Ana Silva', email: 'ana.silva@email.com', phone: '(11) 98765-4321', minCommissionPercentage: 3, maxCommissionPercentage: 5, goal: 15000, newClientsGoal: 10, status: 'Ativo', photoUrl: 'https://placehold.co/64x64.png' },
  { id: 'adv2', name: 'Bruno Costa', email: 'bruno.costa@email.com', phone: '(21) 91234-5678', minCommissionPercentage: 2.5, maxCommissionPercentage: 4.5, goal: 12000, newClientsGoal: 8, status: 'Ativo', photoUrl: 'https://placehold.co/64x64.png' },
  { id: 'adv3', name: 'Carla Dias', email: 'carla.dias@email.com', phone: '(31) 95555-4444', minCommissionPercentage: 3, maxCommissionPercentage: 5, goal: 18000, newClientsGoal: 12, status: 'Férias', photoUrl: 'https://placehold.co/64x64.png' },
  { id: 'adv4', name: 'Daniel Alves', email: 'daniel.alves@email.com', phone: '(41) 94444-3333', minCommissionPercentage: 3, maxCommissionPercentage: 5, goal: 10000, newClientsGoal: 7, status: 'Demitido', photoUrl: 'https://placehold.co/64x64.png' },
];

export const messengers: Messenger[] = [
  { id: 'msg1', name: 'Eduardo Martins', email: 'eduardo.m@email.com', phone: '(51) 93333-2222', status: 'Ativo', receivesCommission: true, commissionPercentage: 5, photoUrl: 'https://placehold.co/64x64.png' },
  { id: 'msg2', name: 'Fernanda Lima', email: 'fernanda.l@email.com', phone: '(61) 92222-1111', status: 'Ativo', receivesCommission: false, photoUrl: 'https://placehold.co/64x64.png' },
  { id: 'msg3', name: 'Gabriel Souza', email: 'gabriel.s@email.com', phone: '(71) 91111-0000', status: 'Licença Médica', receivesCommission: true, commissionPercentage: 4, photoUrl: 'https://placehold.co/64x64.png' },
];

export const donors: Donor[] = [
  { id: 'donor1', code: 'D001', name: 'Empresa Alpha', email: 'alpha@corp.com', status: 'Ativo', assessor: 'Ana Silva', amount: 500, joinDate: '2023-05-15', isLoyal: true, paymentDay: '10', history: [], phones: [{value: "111-222"}], addresses:[] },
  { id: 'donor2', code: 'D002', name: 'Instituto Beta', email: 'beta@inst.org', status: 'Ativo', assessor: 'Bruno Costa', amount: 250, joinDate: '2024-01-20', isLoyal: true, paymentDay: '15', history: [], phones: [{value: "111-222"}], addresses:[] },
  { id: 'donor3', code: 'D003', name: 'Comércio Gama', email: 'gama@trade.com', status: 'Inativo', assessor: 'Ana Silva', amount: 100, joinDate: '2023-11-10', isLoyal: false, history: [], phones: [{value: "111-222"}], addresses:[] },
  { id: 'donor4', code: 'D004', name: 'Fundação Delta', email: 'delta@found.org', status: 'Pendente', assessor: 'Carla Dias', amount: 0, joinDate: '2024-06-01', isLoyal: false, history: [], phones: [{value: "111-222"}], addresses:[] },
  { id: 'donor5', code: 'D005', name: 'Organização Epsilon', email: 'epsilon@org.com', status: 'Ativo', assessor: 'Ana Silva', amount: 1000, joinDate: '2022-03-30', isLoyal: true, paymentDay: '5', history: [], phones: [{value: "111-222"}], addresses:[] },
];

export const donations: Donation[] = [
  // Donations for Empresa Alpha (D001)
  { id: 'don1', donorName: 'Empresa Alpha', donorCode: 'D001', amount: 500, dueDate: '2024-07-10', paymentDate: '2024-07-09', status: 'Pago', assessor: 'Ana Silva', messenger: '', paymentMethod: 'PIX' },
  { id: 'don2', donorName: 'Empresa Alpha', donorCode: 'D001', amount: 500, dueDate: '2024-06-10', paymentDate: '2024-06-10', status: 'Pago', assessor: 'Ana Silva', messenger: '', paymentMethod: 'PIX' },
  { id: 'don3', donorName: 'Empresa Alpha', donorCode: 'D001', amount: 500, dueDate: '2024-05-10', paymentDate: '2024-05-11', status: 'Pago', assessor: 'Ana Silva', messenger: '', paymentMethod: 'PIX' },
  
  // Donations for Instituto Beta (D002)
  { id: 'don4', donorName: 'Instituto Beta', donorCode: 'D002', amount: 250, dueDate: '2024-07-15', status: 'Pendente', assessor: 'Bruno Costa', messenger: 'Eduardo Martins', paymentMethod: 'Coleta' },
  { id: 'don5', donorName: 'Instituto Beta', donorCode: 'D002', amount: 250, dueDate: '2024-06-15', paymentDate: '2024-06-14', status: 'Pago', assessor: 'Bruno Costa', messenger: 'Eduardo Martins', paymentMethod: 'Coleta' },

  // Donations for Comércio Gama (D003)
  { id: 'don6', donorName: 'Comércio Gama', donorCode: 'D003', amount: 100, dueDate: '2024-04-10', status: 'Cancelado', assessor: 'Ana Silva', messenger: '', paymentMethod: 'Transferência Bancária' },

  // Donations for Organização Epsilon (D005)
  { id: 'don7', donorName: 'Organização Epsilon', donorCode: 'D005', amount: 1000, dueDate: '2024-07-05', paymentDate: '2024-07-05', status: 'Pago', assessor: 'Ana Silva', messenger: '', paymentMethod: 'Transferência Bancária' },
  { id: 'don8', donorName: 'Organização Epsilon', donorCode: 'D005', amount: 1000, dueDate: '2024-06-05', paymentDate: '2024-06-03', status: 'Pago', assessor: 'Ana Silva', messenger: '', paymentMethod: 'Transferência Bancária' },

  // Other donations
  { id: 'don9', donorName: 'Novo Doador Teste', donorCode: 'D006', amount: 50, dueDate: '2024-07-20', status: 'Pendente', assessor: 'Bruno Costa', messenger: 'Fernanda Lima', paymentMethod: 'Coleta' },
  { id: 'don10', donorName: 'Outro Doador', donorCode: 'D007', amount: 75, dueDate: '2024-06-25', paymentDate: '2024-06-25', status: 'Pago', assessor: 'Bruno Costa', messenger: 'Eduardo Martins', paymentMethod: 'Coleta' },
  { id: 'don11', donorName: 'Instituto Beta', donorCode: 'D002', amount: 250, dueDate: '2024-05-15', paymentDate: '2024-05-20', status: 'Pago', assessor: 'Bruno Costa', messenger: 'Eduardo Martins', paymentMethod: 'Coleta' },
  { id: 'don12', donorName: 'Organização Epsilon', donorCode: 'D005', amount: 1000, dueDate: '2024-05-05', paymentDate: '2024-05-04', status: 'Pago', assessor: 'Ana Silva', messenger: '', paymentMethod: 'Transferência Bancária' },
];
