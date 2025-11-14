import axios, { AxiosInstance, AxiosError } from 'axios';
import { storage } from './storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await storage.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const { data } = await this.client.post('/api/v1/auth/login', {
      username,
      password,
    });
    return data;
  }

  async register(username: string, password: string, role: 'ADMIN' | 'USER') {
    const { data } = await this.client.post('/api/v1/auth/register', {
      username,
      password,
      role,
    });
    return data;
  }

  // Device endpoints
  async getDevices() {
    const { data } = await this.client.get('/api/v1/devices');
    return data;
  }

  async getDevice(id: string) {
    const { data } = await this.client.get(`/api/v1/devices/${id}`);
    return data;
  }

  async createDevice(device: any) {
    const { data } = await this.client.post('/api/v1/devices', device);
    return data;
  }

  async updateDevice(id: string, device: any) {
    const { data } = await this.client.patch(`/api/v1/devices/${id}`, device);
    return data;
  }

  async deleteDevice(id: string) {
    const { data } = await this.client.delete(`/api/v1/devices/${id}`);
    return data;
  }

  // Reports endpoints
  async getDailyReports(params?: any) {
    const { data } = await this.client.get('/api/v1/reports/daily', { params });
    return data;
  }

  async getMonthlyReports(params?: any) {
    const { data } = await this.client.get('/api/v1/reports/monthly', { params });
    return data;
  }

  async createReport(report: any) {
    const { data } = await this.client.post('/api/v1/reports', report);
    return data;
  }

  // MQTT publish endpoint (for admin web to send commands via backend)
  async publishMqtt(topic: string, message: any) {
    const { data } = await this.client.post('/api/v1/mqtt/publish', {
      topic,
      message,
    });
    return data;
  }
}

export const api = new ApiClient();
