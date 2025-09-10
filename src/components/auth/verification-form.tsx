'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

const TIMER_SECONDS = 30;

interface VerificationFormProps {
  onSuccess: () => void;
}

export function VerificationForm({ onSuccess }: VerificationFormProps) {
  const [code, setCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { toast } = useToast();

  const sendCode = useCallback(() => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(newCode);
    toast({
      title: 'Código de Verificação',
      description: `Para fins de demonstração, seu código é: ${newCode}`,
      duration: 15000,
    });
    setTimer(TIMER_SECONDS);
    setIsResendDisabled(true);
  }, [toast]);

  useEffect(() => {
    sendCode();
  }, [sendCode]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code === verificationCode) {
      toast({
        title: 'Sucesso!',
        description: 'Login verificado com sucesso.',
      });
      onSuccess();
    } else {
      toast({
        title: 'Erro',
        description: 'Código de verificação incorreto.',
        variant: 'destructive',
      });
    }
  };

  const handleResendCode = () => {
    sendCode();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Verificação Necessária</CardTitle>
          <CardDescription className="text-center">
            Por favor, insira o código de 6 dígitos que foi exibido para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="- - - - - -"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em]"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verificar
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {timer > 0 ? (
              <p className="text-muted-foreground">
                Reenviar código em {timer}s
              </p>
            ) : (
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={handleResendCode}
                disabled={isResendDisabled}
              >
                Reenviar código
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
