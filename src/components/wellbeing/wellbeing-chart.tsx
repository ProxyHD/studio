'use client';

import { useMemo, useContext } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';
import { format, subDays, isSameDay } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export function WellbeingChart() {
  const { moodLogs, completedHabits, locale } = useContext(AppContext);
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;

  const chartData = useMemo(() => {
    const data = [];
    const moodToValue: { [key: string]: number } = { 'Angry': 1, 'Sad': 2, 'Ok': 3, 'Good': 4, 'Happy': 5 };

    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateString = date.toISOString().split('T')[0];

      const moodLog = moodLogs.find(log => log.date === dateString);
      const habitsDone = completedHabits.filter(h => h.date === dateString).length;

      data.push({
        name: format(date, 'EEE', { locale: dateLocale }),
        mood: moodLog ? moodToValue[moodLog.mood] : null,
        habits: habitsDone,
      });
    }
    return data;
  }, [moodLogs, completedHabits, locale, dateLocale]);
  
  const moodValueToString = (value: number) => {
    const moodMap: { [key: number]: string } = { 1: 'Angry', 2: 'Sad', 3: 'Ok', 4: 'Good', 5: 'Happy' };
    return t(moodMap[value] || 'N/A', locale);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Weekly Summary', locale)}</CardTitle>
        <CardDescription>{t('Your mood and habits from the last 7 days.', locale)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={moodValueToString} domain={[0, 5]} ticks={[1,2,3,4,5]} />
            <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
               contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              formatter={(value: any, name: any) => {
                 if (name === 'mood') return moodValueToString(value as number);
                 return value;
              }}
            />
            <Legend formatter={(value) => t(value.charAt(0).toUpperCase() + value.slice(1), locale)} />
            <Line yAxisId="left" type="monotone" dataKey="mood" name="Mood" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 4 }} connectNulls />
            <Bar yAxisId="right" dataKey="habits" name="Habits" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} barSize={20} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
