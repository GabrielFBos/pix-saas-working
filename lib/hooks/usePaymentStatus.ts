import { useState, useEffect, useCallback } from 'react';
import { debounce } from '@/lib/utils';

interface UsePaymentStatusProps {
  txid: string;
  pollingInterval?: number;
  onStatusChange?: (status: PaymentStatus) => void;
}

export function usePaymentStatus(
  txid: string,
  pollingInterval: number = 5000,
  onStatusChange?: (status: PaymentStatus) => void
) {
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar status do pagamento
  const fetchStatus = useCallback(async () => {
    if (!txid) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/pix/status?txid=${txid}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar status do pagamento');
      }

      const data = await response.json();
      const newStatus = data.status as PaymentStatus;

      if (newStatus !== status) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
      console.error('Erro ao buscar status:', err);
    } finally {
      setLoading(false);
    }
  }, [txid, status, onStatusChange]);

  // Debounced fetch para evitar muitas chamadas
  const debouncedFetch = useCallback(
    debounce(fetchStatus, 1000),
    [fetchStatus]
  );

  // Polling automático
  useEffect(() => {
    if (!txid || status === 'paid') return;

    const interval = setInterval(debouncedFetch, pollingInterval);
    
    return () => clearInterval(interval);
  }, [txid, status, pollingInterval, debouncedFetch]);

  // Busca inicial
  useEffect(() => {
    if (txid) {
      fetchStatus();
    }
  }, [txid, fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
}
