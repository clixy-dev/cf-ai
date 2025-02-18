'use client';

import { Card } from "@/components/ui/card";
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { BarChart } from '@/components/ui/charts/bar-chart';
import { LineChart } from '@/components/ui/charts/line-chart';
import { mockFinancialData } from "@/utils/mock/financials";

export function FinancialAnalysis() {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('business.financial.revenue')}
          </h3>
          <p className="text-2xl font-bold">$245k</p>
          <span className="text-sm text-green-500">↑ 12%</span>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('business.financial.expenses')}
          </h3>
          <p className="text-2xl font-bold">$182k</p>
          <span className="text-sm text-red-500">↑ 8%</span>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('business.financial.profit')}
          </h3>
          <p className="text-2xl font-bold">$63k</p>
          <span className="text-sm text-green-500">↑ 4%</span>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('business.financial.cash_flow')}
          </h3>
          <p className="text-2xl font-bold">$42k</p>
          <span className="text-sm text-yellow-500">→ 0%</span>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">
          {t('business.financial.revenue_vs_expenses')}
        </h2>
        <BarChart
          data={mockFinancialData.barChart}
          className="h-[300px]"
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">
          {t('business.financial.cash_flow_forecast')}
        </h2>
        <LineChart
          data={mockFinancialData.lineChart}
          className="h-[300px]"
        />
      </Card>
    </div>
  );
} 