import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { FileDown, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Reports() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

  const { data: dailyReports, isLoading: loadingDaily } = useQuery({
    queryKey: ['reports', 'daily'],
    queryFn: api.getDailyReports,
    enabled: activeTab === 'daily',
  });

  const { data: monthlyReports, isLoading: loadingMonthly } = useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: api.getMonthlyReports,
    enabled: activeTab === 'monthly',
  });

  const exportToCsv = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || '')).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const reports = activeTab === 'daily' ? dailyReports : monthlyReports;
  const isLoading = activeTab === 'daily' ? loadingDaily : loadingMonthly;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('reports.title')}</h1>
              <p className="text-muted-foreground mt-2">
                View and export energy and water usage reports
              </p>
            </div>
            <Button
              onClick={() => exportToCsv(reports || [], `${activeTab}_reports`)}
              disabled={!reports || reports.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {t('reports.export')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('reports.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">{t('reports.daily')}</TabsTrigger>
                  <TabsTrigger value="monthly">{t('reports.monthly')}</TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : reports && reports.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('reports.date')}</TableHead>
                            <TableHead>{t('reports.deviceId')}</TableHead>
                            <TableHead className="text-right">{t('reports.totalEnergy')}</TableHead>
                            <TableHead className="text-right">{t('reports.totalWater')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reports.map((report: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(report.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{report.deviceId}</TableCell>
                              <TableCell className="text-right">
                                {report.energyUsed?.toFixed(2)} {t('units.kwh')}
                              </TableCell>
                              <TableCell className="text-right">
                                {report.waterUsed?.toFixed(0)} {t('units.litres')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No reports available
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="monthly">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : reports && reports.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('reports.date')}</TableHead>
                            <TableHead>{t('reports.deviceId')}</TableHead>
                            <TableHead className="text-right">{t('reports.totalEnergy')}</TableHead>
                            <TableHead className="text-right">{t('reports.totalWater')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reports.map((report: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(report.month).toLocaleDateString('default', {
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </TableCell>
                              <TableCell>{report.deviceId}</TableCell>
                              <TableCell className="text-right">
                                {report.energyUsed?.toFixed(2)} {t('units.kwh')}
                              </TableCell>
                              <TableCell className="text-right">
                                {report.waterUsed?.toFixed(0)} {t('units.litres')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No reports available
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
