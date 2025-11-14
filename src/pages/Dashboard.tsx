import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/TopBar';
import { DeviceCard } from '@/components/DeviceCard';
import { api } from '@/lib/api';
import { mqttService } from '@/lib/mqtt';
import { storage } from '@/lib/storage';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [realtimeDevices, setRealtimeDevices] = useState<Map<string, any>>(new Map());

  // Fetch devices from API
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: api.getDevices,
  });

  // REALTIME: Subscribe to MQTT updates for all devices
  useEffect(() => {
    // Subscribe to all device sensor updates
    mqttService.subscribeToAllDevices();

    const unsubscribe = mqttService.onMessage((topic, payload) => {
      // Parse device ID from topic: devices/{deviceId}/sensor
      const match = topic.match(/devices\/([^\/]+)\/sensor/);
      if (match) {
        const deviceId = match[1];
        setRealtimeDevices((prev) => {
          const updated = new Map(prev);
          updated.set(deviceId, payload);
          // Cache the latest state
          storage.setDeviceState(deviceId, payload);
          return updated;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Load cached device states on mount
  useEffect(() => {
    const loadCachedStates = async () => {
      if (!devices) return;
      
      for (const device of devices) {
        const cachedState = await storage.getDeviceState(device.id);
        if (cachedState) {
          setRealtimeDevices((prev) => {
            const updated = new Map(prev);
            updated.set(device.id, cachedState);
            return updated;
          });
        }
      }
    };

    loadCachedStates();
  }, [devices]);

  // Merge API data with realtime MQTT data
  const mergedDevices = devices?.map((device: any) => ({
    ...device,
    sensorData: realtimeDevices.get(device.id),
  })) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gradient-water">
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.totalDevices')}: {devices?.length || 0}
            </p>
          </div>

          {/* Devices Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mergedDevices.map((device: any, index: number) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DeviceCard device={device} />
              </motion.div>
            ))}
          </div>

          {mergedDevices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('dashboard.devices')} not found</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
