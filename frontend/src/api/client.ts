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
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface MemberData {
  name: string;
  age: number;
  relation: string;
}

export interface AccountData {
  name: string;
  balance: number;
}

export interface IncomeData {
  source: string;
  amount: number;
  account_id: string;
}

export interface TransactionData {
  type: "income" | "expense";
  amount: number;
  description?: string;
  account_id: string;
}

export interface UserData {
  email: string;
  full_name: string;
  password: string;
}

// API

export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
};

export const familyAPI = {
  getMembers: () => api.get('/members/'),
  addMember: (data: MemberData) => api.post('/members/', data),
  createFamilyMember: (data: MemberData) => api.post('/family-members/', data),
  getFamilyMember: (id: string) => api.get(`/family-members/${id}`),
};

export const accountAPI = {
  createAccount: (data: AccountData) => api.post('/accounts/', data),
};

export const incomeAPI = {
  createIncome: (data: IncomeData) => api.post('/incomes/', data),
  getIncomes: () => api.get('/incomes/'),
};

export const transactionAPI = {
  createTransaction: (data: TransactionData) => api.post('/transactions/', data),
};

export const userAPI = {
  createUser: (data: UserData) => api.post('/users/', data),
  getUser: (id: string) => api.get(`/users/${id}`),
};

export default api;
