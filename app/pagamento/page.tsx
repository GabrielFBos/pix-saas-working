'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { usePaymentStatus } from '@/lib/hooks/usePaymentStatus';

// Componente para usar search params com Suspense
function PagamentoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txid = searchParams.get('txid');
  
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para gerenciar status do pagamento
  const { _status, loading: _statusLoading } = usePaymentStatus(txid || '');

  // Função para copiar texto para a área de transferência
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aqui você poderia mostrar uma notificação de sucesso
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Função para buscar dados iniciais do pagamento
  const fetchInitialData = async () => {
    if (!txid) {
      setError('TXID não fornecido');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/pix/status?txid=${txid}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do pagamento');
      }
      
      const data = await response.json();
      setPaymentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [txid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error || 'Dados do pagamento não encontrados'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento PIX</h1>
          <p className="text-gray-600">Escaneie o QR Code ou copie o código PIX</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QRCodeSVG 
              value={paymentData.copyPastePayload || 'PIX_MOCK_PAYLOAD'} 
              size={200}
              level="M"
            />
          </div>
        </div>

        {/* Informações do pagamento */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Valor:</span>
              <span className="font-semibold text-gray-900">
                R$ {(paymentData.amountCents / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">TXID:</span>
              <span className="font-mono text-xs text-gray-500">{paymentData.txid}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Status:</span>
              <span className="font-semibold text-blue-600">{paymentData.status}</span>
            </div>
          </div>
        </div>

        {/* Código PIX para copiar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código PIX (Copie e Cole):
          </label>
          <div className="flex">
            <input
              type="text"
              value={paymentData.copyPastePayload || 'PIX_MOCK_PAYLOAD'}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm font-mono bg-gray-50"
            />
            <Button
              onClick={() => copyToClipboard(paymentData.copyPastePayload || 'PIX_MOCK_PAYLOAD')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md"
            >
              Copiar
            </Button>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao Início
          </Button>
          
          <Button 
            onClick={() => router.push('/pre-cadastro')}
            variant="outline"
            className="w-full"
          >
            Novo Cadastro
          </Button>
        </div>

        {/* Instruções */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Como pagar:</h3>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Abra o app do seu banco</li>
            <li>Escolha a opção PIX</li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Página principal com Suspense
export default function PagamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <PagamentoContent />
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
