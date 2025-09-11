'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, Locale } from '@/lib/types';
import { t } from '@/lib/translations';

interface FinancialChartProps {
  transactions: Transaction[];
  locale: Locale;
}

export function FinancialChart({ transactions, locale }: FinancialChartProps) {
  const chartData = useMemo(() => {
    const dataByMonth: { [key: string]: { name: string; income: number; expense: number } } = {};

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString(locale, { month: 'short', year: '2-digit' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { name: month, income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        dataByMonth[month].income += transaction.amount;
      } else {
        dataByMonth[month].expense += transaction.amount;
      }
    });

    return Object.values(dataByMonth).sort((a,b) => {
        const [aMonth, aYear] = a.name.split(' ');
        const [bMonth, bYear] = b.name.split(' ');
        if(aYear !== bYear) return (aYear || '0') > (bYear || '0') ? 1 : -1;
        const months = locale === 'pt-BR' ? ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
  }, [transactions, locale]);

  const formatCurrency = (value: number) => {
    const currency = locale === 'pt-BR' ? 'EUR' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Monthly Overview', locale)}</CardTitle>
        <CardDescription>{t('Income vs. Expenses', locale)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency}/>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend formatter={(value) => t(value.charAt(0).toUpperCase() + value.slice(1), locale)} />
            <Bar dataKey="income" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
