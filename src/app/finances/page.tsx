'use client';

import { useState, useMemo, useContext } from 'react';
import { PlusCircle, ArrowDownCircle, ArrowUpCircle, DollarSign, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AppContext } from '@/context/app-provider';
import type { Transaction } from '@/lib/types';
import { AddTransactionDialog } from '@/components/finances/add-transaction-dialog';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { FinancialChart } from '@/components/finances/financial-chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { t } from '@/lib/translations';

export default function FinancesPage() {
  const { transactions, setTransactions, locale } = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...transaction,
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
  };
  
  const formatCurrency = (amount: number) => {
    const currency = locale === 'pt-BR' ? 'BRL' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Finances', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t('Financial Summary', locale)}</h2>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('Add Transaction', locale)}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SummaryCard title={t('Total Income', locale)} value={formatCurrency(totalIncome)} icon={TrendingUp} />
            <SummaryCard title={t('Total Expenses', locale)} value={formatCurrency(totalExpenses)} icon={TrendingDown} />
            <SummaryCard title={t('Current Balance', locale)} value={formatCurrency(balance)} icon={Wallet} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FinancialChart transactions={transactions} locale={locale} />
            <Card>
              <CardHeader>
                <CardTitle>{t('Recent Transactions', locale)}</CardTitle>
                <CardDescription>{t('Your last 10 financial movements.', locale)}</CardDescription>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('Description', locale)}</TableHead>
                        <TableHead>{t('Type', locale)}</TableHead>
                        <TableHead className="text-right">{t('Amount', locale)}</TableHead>
                        <TableHead className="text-right">{t('Action', locale)}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map(transaction => (
                        <TableRow key={transaction.id}>
                           <TableCell>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString(locale)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'income' ? 'secondary' : 'destructive'}>
                              {t(transaction.type === 'income' ? 'Income' : 'Expense', locale)}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                           <TableCell className="text-right">
                             <Button variant="ghost" size="icon" onClick={() => deleteTransaction(transaction.id)}>
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {transactions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">{t('No transactions recorded yet.', locale)}</p>
                  )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      <AddTransactionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddTransaction={addTransaction}
      />
    </>
  );
}
