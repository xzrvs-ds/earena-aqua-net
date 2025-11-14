import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/TopBar';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { mqttService, type DeviceSensorData } from '@/lib/mqtt';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Droplets, Gauge, Zap, Activity, Power, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [sensorData, setSensorData] = useState<DeviceSensorData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timerDuration, setTimerDuration] = useState<number>(120);
  const [targetHeight, setTargetHeight] = useState<number>(100);

  // Fetch device info
  const { data: device, isLoading } = useQuery({
    queryKey: ['device', id],
    queryFn: () => api.getDevice(id!),
    enabled: !!id,
  });

  // REALTIME: Subscribe to device sensor updates
  useEffect(() => {
    if (!id) return;

    mqttService.subscribeToDevice(id);

    const unsubscribe = mqttService.onMessage((topic, payload) => {
      if (topic === `devices/${id}/sensor`) {
        setSensorData(payload);
        storage.setDeviceState(id, payload);
        
        // Update chart data (keep last 20 points)
        setChartData((prev) => {
          const newData = [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              power: payload.power,
              flowRate: payload.flowRate,
              waterDepth: payload.waterDepth,
            },
          ].slice(-20);
          return newData;
        });
      }
    });

    // Load cached state
    storage.getDeviceState(id).then((cached) => {
      if (cached) {
        setSensorData(cached);
      }
    });

    return () => {
      unsubscribe();
      mqttService.unsubscribeFromDevice(id);
    };
  }, [id]);

  const handleMotorControl = async (state: 'ON' | 'OFF') => {
    if (!id) return;

    try {
      await mqttService.publishCommand(id, {
        type: 'motor',
        state,
      });

      toast({
        title: t('app.success'),
        description: t('controls.success'),
      });
    } catch (error) {
      console.error('Motor control error:', error);
      toast({
        variant: 'destructive',
        title: t('app.error'),
        description: t('controls.error'),
      });
    }
  };

  const handleTimerSet = async () => {
    if (!id) return;

    try {
      await mqttService.publishCommand(id, {
        type: 'timer',
        duration: timerDuration,
      });

      toast({
        title: t('app.success'),
        description: t('controls.success'),
      });
    } catch (error) {
      console.error('Timer set error:', error);
      toast({
        variant: 'destructive',
        title: t('app.error'),
        description: t('controls.error'),
      });
    }
  };

  const handleHeightSet = async () => {
    if (!id) return;

    try {
      await mqttService.publishCommand(id, {
        type: 'height',
        value: targetHeight,
      });

      toast({
        title: t('app.success'),
        description: t('controls.success'),
      });
    } catch (error) {
      console.error('Height set error:', error);
      toast({
        variant: 'destructive',
        title: t('app.error'),
        description: t('controls.error'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Device not found</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      icon: Droplets,
      label: t('device.waterDepth'),
      value: sensorData?.waterDepth || 0,
      unit: t('units.cm'),
      color: 'text-primary',
    },
    {
      icon: Gauge,
      label: t('device.flowRate'),
      value: sensorData?.flowRate || 0,
      unit: t('units.lpm'),
      color: 'text-primary',
    },
    {
      icon: Zap,
      label: t('device.power'),
      value: sensorData?.power || 0,
      unit: t('units.watts'),
      color: 'text-secondary',
    },
    {
      icon: Activity,
      label: t('device.current'),
      value: sensorData?.current || 0,
      unit: t('units.amps'),
      color: 'text-secondary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{device.name}</h1>
                {device.location && (
                  <p className="text-muted-foreground mt-1">{device.location}</p>
                )}
              </div>
            </div>
            <StatusBadge online={device.online} />
          </div>

          {/* Motor Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Power className="h-5 w-5" />
                {t('device.motorState')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full ${
                      sensorData?.motorState ? 'bg-success animate-pulse-glow' : 'bg-muted-foreground'
                    }`}
                  />
                  <span className="text-lg font-medium">
                    {sensorData?.motorState ? t('device.motorOn') : t('device.motorOff')}
                  </span>
                </div>
                {sensorData?.timerRemaining && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{sensorData.timerRemaining}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{metric.value.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Real-time Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="power"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      dot={false}
                      name={t('device.power')}
                    />
                    <Line
                      type="monotone"
                      dataKey="flowRate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      name={t('device.flowRate')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>{t('controls.title')}</CardTitle>
              <CardDescription>
                Send commands to control device behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Motor Control */}
              <div className="space-y-3">
                <Label>{t('controls.motor')}</Label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleMotorControl('ON')}
                    variant="default"
                    className="flex-1"
                  >
                    {t('controls.turnOn')}
                  </Button>
                  <Button
                    onClick={() => handleMotorControl('OFF')}
                    variant="secondary"
                    className="flex-1"
                  >
                    {t('controls.turnOff')}
                  </Button>
                </div>
              </div>

              {/* Timer Control */}
              <div className="space-y-3">
                <Label htmlFor="timer">{t('controls.timer')}</Label>
                <div className="flex gap-3">
                  <Input
                    id="timer"
                    type="number"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    placeholder={t('controls.duration')}
                    min={0}
                  />
                  <Button onClick={handleTimerSet}>
                    {t('controls.apply')}
                  </Button>
                </div>
              </div>

              {/* Height Control */}
              <div className="space-y-3">
                <Label htmlFor="height">{t('controls.height')}</Label>
                <div className="flex gap-3">
                  <Input
                    id="height"
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(Number(e.target.value))}
                    placeholder={t('controls.targetHeight')}
                    min={0}
                  />
                  <Button onClick={handleHeightSet}>
                    {t('controls.apply')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

