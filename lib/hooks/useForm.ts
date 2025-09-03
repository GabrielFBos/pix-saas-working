import { useState, useCallback } from 'react';
import { z, ZodSchema } from 'zod';

interface UseFormProps<T> {
  initialValues: T;
  validationSchema: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormProps<T>) {
  const [_values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Função para validar o formulário
  const validate = useCallback((data: T): boolean => {
    try {
      validationSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [validationSchema]);

  // Função para lidar com mudanças nos campos
  const handleChange = useCallback((field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Função para submeter o formulário
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate(_values)) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(_values);
    } catch (error) {
      console.error('Erro no formulário:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Erro inesperado' });
    } finally {
      setLoading(false);
    }
  }, [_values, validate, onSubmit]);

  // Função para resetar o formulário
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setLoading(false);
  }, [initialValues]);

  // Função para definir valores
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // Função para definir erros
  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  return {
    values: _values,
    errors,
    loading,
    handleChange,
    handleSubmit,
    reset,
    setValue,
    setFieldError,
    validate: () => validate(_values),
  };
}
