'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Componente para usar search params com Suspense
function ConfirmadoContent() {
  const searchParams = useSearchParams();
  const txid = searchParams.get('txid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (!txid) {
      setError('TXID não fornecido');
      setLoading(false);
      return;
    }

    fetchConfirmation();
  }, [txid]);

  const fetchConfirmation = async () => {
    try {
      const response = await fetch(`/api/pix/status?txid=${txid}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar confirmação');
      }
      
      const data = await response.json();
      setPaymentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
          <p className="text-gray-600">Seu pagamento foi processado com sucesso.</p>
        </div>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Detalhes do Pagamento:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><span className="font-medium">TXID:</span> {paymentData.txid}</div>
              <div><span className="font-medium">Status:</span> {paymentData.status}</div>
              <div><span className="font-medium">Valor:</span> R$ {(paymentData.amountCents / 100).toFixed(2)}</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao Início
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/pre-cadastro'}
            variant="outline"
            className="w-full"
          >
            Novo Cadastro
          </Button>
        </div>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function ConfirmadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <ConfirmadoContent />
    </Suspense>
  );
}

// Viewport export separado
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3B82F6',
};
