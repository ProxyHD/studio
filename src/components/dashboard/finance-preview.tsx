'use client';

import { useMemo, useContext } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export function FinancePreview() {
  const { transactions, locale } = useContext(AppContext);

  const { totalIncome, totalExpenses } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome: income, totalExpenses: expenses };
  }, [transactions]);

  const chartData = [
    { name: t('Income', locale), value: totalIncome },
    { name: t('Expense', locale), value: totalExpenses },
  ];

  const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-5))'];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t('Financial Summary', locale)}</CardTitle>
        <CardDescription>{t('A quick look at your finances.', locale)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {transactions.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full py-8">
            <p className="text-sm text-muted-foreground">{t('No transactions recorded yet.', locale)}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/finances">
            {t('View Full Report', locale)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
