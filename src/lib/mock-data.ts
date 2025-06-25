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
  phones: { value: string }[];
  addresses: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    reference: string;
  }[];
  history: { // This is now populated dynamically
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
