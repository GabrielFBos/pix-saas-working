'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { InlineError } from '@/components/ui/ErrorMessage';
import { useForm } from '@/lib/hooks/useForm';
import { preCadastroSchema, PreCadastroForm as PreCadastroFormType } from '@/lib/validation';

export function PreCadastroForm() {
  const router = useRouter();

  const handleSubmit = async (values: PreCadastroFormType) => {
    const response = await fetch('/api/pre-cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao processar cadastro');
    }

    const { txid } = await response.json();
    
    // Redireciona para a página de pagamento
    router.push(`/pagamento?txid=${txid}`);
  };

  const {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit: handleFormSubmit,
  } = useForm({
    initialValues: { name: '', email: '' },
    validationSchema: preCadastroSchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome completo
        </label>
        <input
          type="text"
          id="name"
          value={values.name}
          onChange={handleChange('name')}
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Digite seu nome completo"
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          value={values.email}
          onChange={handleChange('email')}
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          placeholder="Digite seu e-mail"
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {errors.submit && (
        <InlineError message={errors.submit} />
      )}

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        Continuar para pagamento
      </Button>
    </form>
  );
}
