/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Типы
export interface LoginData {
  username: string;
  password: string;
}


export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  is_parent: boolean;
}


export interface FamilyData {
  id: number;
  name: string;
}

export interface MemberData {
  id: string;  // id всегда есть у существующих членов семьи
  name: string;
  relation: string;
  user_id: number;
  family_id: number;
}

export interface CreateMemberData {
  name: string;
  relation: string;
  user_id: number;
  family_id: number;
}

export interface AccountData {
  name: string;
  balance: number;
  currency?: 'RUB' | 'USD' | 'EUR'; // необязательное поле с дефолтом
  family_member_id: number;         // обязательно
}
export interface FamilyBalances {
  [currency: string]: number;
}

export interface AccountCreateData {
  name: string;
  balance: number;
  currency: Currency;
  family_id: number;
  family_member_id: number;
}

export interface AccountResponse {
  id: number;
  name: string;
  balance: number;
  currency: Currency;
}

type Currency = 'RUB' | 'USD' | 'EUR';


export interface TransactionData {
  type: "income" | "expense";
  amount: number;
  category?: string;
  description?: string;
  account_id: number;
  family_member: MemberData;
}

export interface UserData {
  email: string;
  full_name: string;
  password: string;
}

// API

export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) =>
  api.post('/auth/login', new URLSearchParams(data as any), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  logout: () => api.post('/auth/logout'),
  

};


export const familyAPI = {
  createFamily: (data: { name: string }) => api.post<FamilyData>('/families/', data),
  getMyFamily: () => api.get<FamilyData>('/families/my-family'),
  getFamily: (id: number) => api.get<FamilyData>(`/families/${id}`),
  getMembers: () => 
    api.get('/family-members/'),
  addMember: (data: MemberData) => api.post('/family-members/', data),
  createFamilyMember: (data: CreateMemberData) => api.post<MemberData>('/family-members/', data),
  getFamilyMember: (id: string) => api.get(`/family-members/${id}`),
  updateFamilyMember: (id: string, data: Partial<MemberData>) =>
  api.put(`/family-members/${id}`, data),
  deleteFamilyMember: (id: string) =>
  api.delete(`/family-members/${id}`),

};

export const accountAPI = {
  createAccount: (data: AccountCreateData) => api.post<AccountResponse>('/accounts/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  getAccounts: () => api.get<AccountResponse[]>('/accounts/'),
  fetchFamilyBalances: () => api.get<FamilyBalances>('/accounts/family-balances'),
};


export const transactionAPI = {
  createTransaction: (data: TransactionData) => api.post('/transactions/', data),
  getTransactions: () => api.get<TransactionData[]>('/transactions/'),
  getTransaction: (id: number) => api.get<TransactionData>(`/transactions/${id}`),
};

export const userAPI = {
  createUser: (data: UserData) => api.post('/users/', data),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUserProfile: (userId: number, data: any) => api.patch(`/users/${userId}/family`, data),
  getCurrentUser: () => api.get('/users/me'),
};


export default api;
