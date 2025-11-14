import { Preferences } from '@capacitor/preferences';

export const storageKeys = {
  AUTH_TOKEN: 'auth.token',
  USER_DATA: 'auth.user',
  DEVICE_STATE_PREFIX: 'device.state.',
  OFFLINE_QUEUE: 'outbox.commands',
  LANGUAGE: 'lang',
} as const;

export const storage = {
  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  },

  async get(key: string): Promise<any | null> {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  },

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  },

  async clear(): Promise<void> {
    await Preferences.clear();
  },

  // Auth helpers
  async setToken(token: string): Promise<void> {
    await this.set(storageKeys.AUTH_TOKEN, token);
  },

  async getToken(): Promise<string | null> {
    return await this.get(storageKeys.AUTH_TOKEN);
  },

  async setUser(user: any): Promise<void> {
    await this.set(storageKeys.USER_DATA, user);
  },

  async getUser(): Promise<any | null> {
    return await this.get(storageKeys.USER_DATA);
  },

  async clearAuth(): Promise<void> {
    await this.remove(storageKeys.AUTH_TOKEN);
    await this.remove(storageKeys.USER_DATA);
  },

  // Device state helpers
  async setDeviceState(deviceId: string, state: any): Promise<void> {
    await this.set(`${storageKeys.DEVICE_STATE_PREFIX}${deviceId}`, state);
  },

  async getDeviceState(deviceId: string): Promise<any | null> {
    return await this.get(`${storageKeys.DEVICE_STATE_PREFIX}${deviceId}`);
  },

  // Offline queue
  async queueCommand(command: any): Promise<void> {
    const queue = (await this.get(storageKeys.OFFLINE_QUEUE)) || [];
    queue.push({ ...command, timestamp: Date.now() });
    await this.set(storageKeys.OFFLINE_QUEUE, queue);
  },

  async getOfflineQueue(): Promise<any[]> {
    return (await this.get(storageKeys.OFFLINE_QUEUE)) || [];
  },

  async clearOfflineQueue(): Promise<void> {
    await this.set(storageKeys.OFFLINE_QUEUE, []);
  },
};
