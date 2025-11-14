// REALTIME: MQTT client wrapper for real-time device communication
import mqtt, { MqttClient } from 'mqtt';
import { storage } from './storage';

const MQTT_URL = import.meta.env.VITE_MQTT_URL || 'mqtt://185.217.131.96:1883';
const MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME || 'tr12345678';
const MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD || 'tr12345678';

export type DeviceSensorData = {
  waterDepth: number;
  height: number;
  flowRate: number;
  power: number;
  current: number;
  motorState: boolean;
  timerRemaining: string;
  timestamp: string;
};

export type DeviceCommand = {
  type: 'motor' | 'timer' | 'height';
  state?: 'ON' | 'OFF';
  duration?: number;
  value?: number;
};

export type MessageHandler = (topic: string, payload: any) => void;

class MqttService {
  private client: MqttClient | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private connected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.client = mqtt.connect(MQTT_URL, {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        keepalive: 60,
        clean: false,
        reconnectPeriod: this.reconnectDelay,
        clientId: `earena_client_${Math.random().toString(16).substr(2, 8)}`,
      });

      this.client.on('connect', () => {
        console.log('[MQTT] Connected to broker');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.flushOfflineQueue();
      });

      this.client.on('message', (topic, payload) => {
        try {
          const message = JSON.parse(payload.toString());
          this.handlers.forEach((handler) => handler(topic, message));
        } catch (error) {
          console.error('[MQTT] Error parsing message:', error);
        }
      });

      this.client.on('error', (error) => {
        console.error('[MQTT] Connection error:', error);
        this.connected = false;
      });

      this.client.on('offline', () => {
        console.log('[MQTT] Client offline');
        this.connected = false;
      });

      this.client.on('reconnect', () => {
        this.reconnectAttempts++;
        console.log(`[MQTT] Reconnecting... (attempt ${this.reconnectAttempts})`);
        
        if (this.reconnectAttempts > this.maxReconnectAttempts) {
          // Exponential backoff
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, 60000);
        }
      });

      this.client.on('close', () => {
        console.log('[MQTT] Connection closed');
        this.connected = false;
      });
    } catch (error) {
      console.error('[MQTT] Failed to connect:', error);
      this.connected = false;
    }
  }

  // Subscribe to device sensor data
  subscribeToDevice(deviceId: string) {
    if (!this.client) return;

    const topics = [
      `devices/${deviceId}/sensor`,
      `devices/${deviceId}/status`,
      `devices/${deviceId}/report_ack`,
    ];

    topics.forEach((topic) => {
      this.client?.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`[MQTT] Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`[MQTT] Subscribed to ${topic}`);
        }
      });
    });
  }

  // Subscribe to all devices (for admin panel)
  subscribeToAllDevices() {
    if (!this.client) return;

    const topic = 'devices/+/sensor';
    this.client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[MQTT] Failed to subscribe to ${topic}:`, err);
      } else {
        console.log(`[MQTT] Subscribed to ${topic}`);
      }
    });
  }

  // Unsubscribe from device
  unsubscribeFromDevice(deviceId: string) {
    if (!this.client) return;

    const topics = [
      `devices/${deviceId}/sensor`,
      `devices/${deviceId}/status`,
      `devices/${deviceId}/report_ack`,
    ];

    topics.forEach((topic) => {
      this.client?.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Failed to unsubscribe from ${topic}:`, err);
        } else {
          console.log(`[MQTT] Unsubscribed from ${topic}`);
        }
      });
    });
  }

  // Publish command to device
  async publishCommand(deviceId: string, command: DeviceCommand) {
    const topic = `devices/${deviceId}/command`;
    const payload = JSON.stringify(command);

    if (this.connected && this.client) {
      return new Promise((resolve, reject) => {
        this.client!.publish(topic, payload, { qos: 1 }, (err) => {
          if (err) {
            console.error('[MQTT] Failed to publish command:', err);
            reject(err);
          } else {
            console.log('[MQTT] Command published:', command);
            resolve(true);
          }
        });
      });
    } else {
      // Queue command for later if offline
      console.log('[MQTT] Offline - queueing command');
      await storage.queueCommand({ topic, payload, command });
      return false;
    }
  }

  // Flush offline command queue when reconnected
  private async flushOfflineQueue() {
    try {
      const queue = await storage.getOfflineQueue();
      if (queue.length === 0) return;

      console.log(`[MQTT] Flushing ${queue.length} queued commands`);

      for (const item of queue) {
        await this.client?.publish(item.topic, item.payload, { qos: 1 });
      }

      await storage.clearOfflineQueue();
      console.log('[MQTT] Offline queue flushed');
    } catch (error) {
      console.error('[MQTT] Error flushing offline queue:', error);
    }
  }

  // Register message handler
  onMessage(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  // Check connection status
  isConnected(): boolean {
    return this.connected;
  }

  // Disconnect
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.connected = false;
    }
  }
}

export const mqttService = new MqttService();
