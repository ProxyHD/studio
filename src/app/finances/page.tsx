
'use client';

import { useState, useMemo, useContext } from 'react';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, Wallet, Pencil } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { t } from '@/lib/translations';

export default function FinancesPage() {
  const { transactions, setTransactions, locale, formatCurrency } = useContext(AppContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddDialog = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };
  
  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      const updatedTransaction: Transaction = { ...editingTransaction, ...transactionData };
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
    } else {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        ...transactionData,
      };
      setTransactions((prev) => [...prev, newTransaction]);
    }
    setEditingTransaction(null);
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
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
  
  const totalTransactions = totalIncome + totalExpenses;
  const incomePercentage = totalTransactions > 0 ? (totalIncome / totalTransactions) * 100 : 0;
  const expensePercentage = totalTransactions > 0 ? (totalExpenses / totalTransactions) * 100 : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <>
      <div className="flex flex-col h-full">
        <SiteHeader title={t('Finances', locale)} />
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">{t('Financial Summary', locale)}</h2>
              <Button onClick={handleOpenAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('Add Transaction', locale)}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SummaryCard 
                  title={t('Total Income', locale)} 
                  value={formatCurrency(totalIncome)} 
                  icon={TrendingUp} 
                  description={`${t('% of total', locale)}: ${incomePercentage.toFixed(1)}%`}
              />
              <SummaryCard 
                  title={t('Total Expenses', locale)} 
                  value={formatCurrency(totalExpenses)} 
                  icon={TrendingDown}
                  description={`${t('% of total', locale)}: ${expensePercentage.toFixed(1)}%`}
              />
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
                  {transactions.length > 0 ? (
                    <ScrollArea className="h-[280px]">
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
                                <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(transaction)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteTransaction(transaction.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-[280px]">
                      <p className="text-sm text-muted-foreground text-center">{t('No transactions recorded yet.', locale)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <AddTransactionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveTransaction={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </>
  );
}
