import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StatusBadge } from './StatusBadge';
import { Droplets, Gauge, Zap, Activity, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DeviceSensorData } from '@/lib/mqtt';

type DeviceCardProps = {
  device: {
    id: string;
    name: string;
    location?: string;
    online: boolean;
    lastSeen?: string;
    sensorData?: DeviceSensorData;
  };
};

export const DeviceCard = ({ device }: DeviceCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const metrics = [
    {
      icon: Droplets,
      label: t('device.waterDepth'),
      value: device.sensorData?.waterDepth || 0,
      unit: t('units.cm'),
      color: 'text-primary',
    },
    {
      icon: Gauge,
      label: t('device.flowRate'),
      value: device.sensorData?.flowRate || 0,
      unit: t('units.lpm'),
      color: 'text-primary',
    },
    {
      icon: Zap,
      label: t('device.power'),
      value: device.sensorData?.power || 0,
      unit: t('units.watts'),
      color: 'text-secondary',
    },
    {
      icon: Activity,
      label: t('device.current'),
      value: device.sensorData?.current || 0,
      unit: t('units.amps'),
      color: 'text-secondary',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group cursor-pointer border-border/50 transition-all hover:border-primary/50 hover:shadow-lg"
        onClick={() => navigate(`/device/${device.id}`)}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{device.name}</CardTitle>
              {device.location && (
                <p className="text-sm text-muted-foreground">{device.location}</p>
              )}
            </div>
            <StatusBadge online={device.online} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Motor Status */}
          <div className="flex items-center justify-between rounded-lg bg-accent/50 p-3">
            <div className="flex items-center gap-2">
              <Power className={`h-5 w-5 ${device.sensorData?.motorState ? 'text-success' : 'text-muted-foreground'}`} />
              <span className="font-medium">
                {device.sensorData?.motorState ? t('device.motorOn') : t('device.motorOff')}
              </span>
            </div>
            {device.sensorData?.timerRemaining && (
              <span className="text-sm text-muted-foreground">
                {device.sensorData.timerRemaining}
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-border/50 bg-card p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">{metric.value.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
