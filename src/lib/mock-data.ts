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
  history: {
    date: string;
    amount: number;
    status: 'Pago' | 'Pendente' | 'Falhou';
  }[];
};

export type Donation = {
  id: string;
  donorName: string;
  donorCode: string;
  amount: number;
  paymentDate: string;
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

type MonthlyResult = {
  id: string;
  referenceMonth: string;
  recipientName: string;
  recipientType: 'Assessor' | 'Mensageiro';
  baseAmount: number;
  newClientsResult?: number;
  status: 'Paga' | 'Pendente';
  paymentDate?: string;
};

// Data
export const advisorsData: Advisor[] = [
  { id: 'ASS001', name: 'Carlos Almeida', email: 'carlos.almeida@example.com', phone: '(11) 98765-1111', photoUrl: 'https://placehold.co/128x128.png', minCommissionPercentage: 3, maxCommissionPercentage: 5, goal: 15000, newClientsGoal: 10, status: 'Ativo' },
  { id: 'ASS002', name: 'Ana Beatriz', email: 'ana.beatriz@example.com', phone: '(21) 91234-2222', photoUrl: 'https://placehold.co/128x128.png', minCommissionPercentage: 3.5, maxCommissionPercentage: 5.5, goal: 18000, newClientsGoal: 12, status: 'Ativo' },
  { id: 'ASS003', name: 'Juliana Lima', email: 'juliana.lima@example.com', phone: '(51) 94444-3333', photoUrl: 'https://placehold.co/128x128.png', minCommissionPercentage: 4, maxCommissionPercentage: 6, goal: 20000, newClientsGoal: 15, status: 'Demitido' },
  { id: 'ASS004', name: 'Marcos Ribeiro', email: 'marcos.ribeiro@example.com', phone: '(31) 99999-4444', photoUrl: 'https://placehold.co/128x128.png', minCommissionPercentage: 2.5, maxCommissionPercentage: 4.5, goal: 12000, newClientsGoal: 8, status: 'Férias' },
  { id: 'ASS005', name: 'Ricardo Neves', email: 'ricardo.neves@example.com', phone: '(41) 98888-5555', photoUrl: 'https://placehold.co/128x128.png', minCommissionPercentage: 3.2, maxCommissionPercentage: 5.2, goal: 16000, newClientsGoal: 11, status: 'Suspensão' },
];

export const messengersData: Messenger[] = [
  { id: 'MEN001', name: 'Fábio Souza', email: 'fabio.souza@example.com', phone: '(11) 91111-1111', status: 'Ativo', commissionPercentage: 2.5, photoUrl: 'https://placehold.co/128x128.png' },
  { id: 'MEN002', name: 'Gabi Lima', email: 'gabi.lima@example.com', phone: '(21) 92222-2222', status: 'Ativo', photoUrl: 'https://placehold.co/128x128.png' },
  { id: 'MEN003', name: 'Hugo Costa', email: 'hugo.costa@example.com', phone: '(51) 93333-3333', status: 'Férias', commissionPercentage: 3, photoUrl: 'https://placehold.co/128x128.png' },
  { id: 'MEN004', name: 'Leo Martins', email: 'leo.martins@example.com', phone: '(31) 94444-4444', status: 'Demitido', photoUrl: 'https://placehold.co/128x128.png' },
  { id: 'MEN005', name: 'Íris Alves', email: 'iris.alves@example.com', phone: '(41) 95555-5555', status: 'Licença Médica', photoUrl: 'https://placehold.co/128x128.png' },
];

const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

const getDateString = (date: Date) => date.toISOString().split('T')[0];

export const donorsData: Donor[] = [
  { id: 'DON001', code: 'DON001', name: 'João da Silva', email: 'joao.silva@example.com', status: 'Ativo', assessor: 'Carlos Almeida', amount: 150.00, joinDate: '2023-01-15', isLoyal: true, paymentDay: '15', phones: [{ value: '(11) 98765-4321' }], addresses: [{ cep: '01001-000', street: 'Praça da Sé', number: '10', complement: 'Lado A', neighborhood: 'Sé', city: 'São Paulo', state: 'SP', reference: 'Próximo à Catedral' }], history: [
    { date: getDateString(new Date(today.getFullYear(), today.getMonth(), 15)), amount: 150.00, status: 'Pago' },
    { date: getDateString(new Date(today.getFullYear(), today.getMonth() - 1, 15)), amount: 150.00, status: 'Pago' },
    { date: getDateString(new Date(today.getFullYear(), today.getMonth() - 2, 15)), amount: 150.00, status: 'Pago' },
  ]},
  { id: 'DON002', code: 'DON002', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 200.00, joinDate: '2023-02-20', isLoyal: false, phones: [{ value: '(21) 91234-5678' }], addresses: [{ cep: '20031-912', street: 'Av. Graça Aranha', number: '1', complement: '', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ', reference: '' }], history: [
    { date: getDateString(new Date(today.getFullYear(), today.getMonth(), 20)), amount: 200.00, status: 'Pago' },
    { date: getDateString(new Date(today.getFullYear(), today.getMonth() - 1, 20)), amount: 200.00, status: 'Pendente' },
    { date: getDateString(new Date(today.getFullYear(), today.getMonth() - 2, 20)), amount: 200.00, status: 'Pago' },
  ]},
  { id: 'DON003', code: 'DON003', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', status: 'Inativo', assessor: 'Carlos Almeida', amount: 50.00, joinDate: '2023-03-10', isLoyal: false, phones: [{value: '(31) 98888-7777'}], addresses: [], history: [
    { date: '2024-03-10', amount: 50.00, status: 'Pago' },
    { date: '2024-02-10', amount: 50.00, status: 'Falhou' },
  ]},
  { id: 'DON004', code: 'DON004', name: 'Ana Costa', email: 'ana.costa@example.com', status: 'Ativo', assessor: 'Direto', amount: 100.00, joinDate: getDateString(new Date(today.getFullYear(), today.getMonth(), 5)), isLoyal: true, paymentDay: '5', phones: [{value: '(41) 96666-5555'}], addresses: [], history: [
    { date: getDateString(new Date(today.getFullYear(), today.getMonth(), 5)), amount: 100.00, status: 'Pago' },
  ]},
  { id: 'DON005', code: 'DON005', name: 'Pedro Santos', email: 'pedro.santos@example.com', status: 'Pendente', assessor: 'Juliana Lima', amount: 75.00, joinDate: '2023-05-12', isLoyal: false, phones: [{value: '(51) 94444-3333'}], addresses: [], history: []},
  { id: 'DON006', code: 'DON006', name: 'Sofia Lima', email: 'sofia.lima@example.com', status: 'Ativo', assessor: 'Ana Beatriz', amount: 300.00, joinDate: getDateString(new Date(today.getFullYear(), today.getMonth() - 1, 18)), isLoyal: true, paymentDay: '20', phones: [{value: '(61) 92222-1111'}], addresses: [], history: [
    { date: getDateString(new Date(today.getFullYear(), today.getMonth() - 1, 18)), amount: 300.00, status: 'Pago' },
    { date: getDateString(new Date(today.getFullYear(), today.getMonth() - 2, 18)), amount: 300.00, status: 'Pago' },
  ]},
  { id: 'DON007', code: 'DON007', name: 'Lucas Souza', email: 'lucas.souza@example.com', status: 'Inativo', assessor: 'Direto', amount: 25.00, joinDate: '2023-07-22', isLoyal: false, phones: [{value: '(71) 91111-0000'}], addresses: [], history: [
    { date: '2024-01-22', amount: 25.00, status: 'Pago' },
  ]},
  { id: 'DON008', code: 'DON008', name: 'Novo Doador do Mês', email: 'novo.doador@example.com', status: 'Ativo', assessor: 'Carlos Almeida', amount: 100.00, joinDate: getDateString(today), isLoyal: false, phones: [{value: '(11) 98765-1234'}], addresses: [], history: [
    { date: getDateString(today), amount: 100.00, status: 'Pago' },
  ]},
];

const monthlyResults: MonthlyResult[] = [
    { id: 'COM001', referenceMonth: 'Julho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor', baseAmount: 10000, newClientsResult: 8, status: 'Paga', paymentDate: '2024-08-05' },
    { id: 'COM002', referenceMonth: 'Julho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor', baseAmount: 12500, newClientsResult: 13, status: 'Pendente', paymentDate: undefined },
    { id: 'COM003', referenceMonth: 'Julho/2024', recipientName: 'Fábio Souza', recipientType: 'Mensageiro', baseAmount: 5000, status: 'Paga', paymentDate: '2024-08-05' },
    { id: 'COM004', referenceMonth: 'Junho/2024', recipientName: 'Carlos Almeida', recipientType: 'Assessor', baseAmount: 9500, newClientsResult: 11, status: 'Paga', paymentDate: '2024-07-05' },
    { id: 'COM005', referenceMonth: 'Junho/2024', recipientName: 'Hugo Costa', recipientType: 'Mensageiro', baseAmount: 0, status: 'Paga', paymentDate: '2024-07-05' },
    { id: 'COM006', referenceMonth: 'Junho/2024', recipientName: 'Ana Beatriz', recipientType: 'Assessor', baseAmount: 20000, newClientsResult: 10, status: 'Paga', paymentDate: '2024-07-05' },
];

export const allCollaborators = [
  ...advisorsData.map(a => ({ id: a.id, name: a.name, type: 'Assessor' as const })),
  ...messengersData.map(m => ({ id: m.id, name: m.name, type: 'Mensageiro' as const })),
];

export const calculateCommissions = (
    results: typeof monthlyResults,
    advisors: typeof advisorsData,
    messengers: typeof messengersData
): Commission[] => {
    return results.map(result => {
        let commissionRate = 0;
        let commissionAmount = 0;
        let advisorDetails: (typeof advisorsData)[0] | undefined;
        let collaboratorId = '';

        if (result.recipientType === 'Assessor') {
            advisorDetails = advisors.find(a => a.name === result.recipientName);
            if (advisorDetails) {
                collaboratorId = advisorDetails.id;
                const goalMet = result.baseAmount >= advisorDetails.goal;
                commissionRate = goalMet ? advisorDetails.maxCommissionPercentage : advisorDetails.minCommissionPercentage;
                commissionAmount = result.baseAmount * (commissionRate / 100);
            }
        } else { // Mensageiro
            const messengerDetails = messengers.find(m => m.name === result.recipientName);
            if (messengerDetails) {
                collaboratorId = messengerDetails.id;
                if (messengerDetails.commissionPercentage) {
                    commissionRate = messengerDetails.commissionPercentage;
                    commissionAmount = result.baseAmount * (commissionRate / 100);
                }
            }
        }
        
        return {
            id: result.id,
            referenceMonth: result.referenceMonth,
            recipientName: result.recipientName,
            recipientId: collaboratorId,
            recipientType: result.recipientType,
            goal: advisorDetails?.goal,
            baseAmount: result.baseAmount,
            commissionRate,
            commissionAmount,
            status: result.status,
            paymentDate: result.paymentDate,
            newClientsGoal: advisorDetails?.newClientsGoal,
            newClientsResult: result.newClientsResult,
            minCommissionPercentage: advisorDetails?.minCommissionPercentage,
            maxCommissionPercentage: advisorDetails?.maxCommissionPercentage,
        };
    });
};

export const commissionsData: Commission[] = calculateCommissions(monthlyResults, advisorsData, messengersData);

// Helper arrays for dialogs
export const advisorNames = advisorsData.map(a => a.name).filter(name => name !== 'Direto');
export const messengerNames = messengersData.map(m => m.name);
// export const donorOptions = donorsData.map(d => ({ id: d.code, name: d.name, code: d.code }));
