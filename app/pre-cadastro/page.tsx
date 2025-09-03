import { PreCadastroForm } from '@/components/forms/PreCadastroForm';

export default function PreCadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PIX SaaS Learning
          </h1>
          <p className="text-gray-600">
            Faça seu pré-cadastro e continue para o pagamento
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Informações pessoais
            </h2>
            <p className="text-sm text-gray-600">
              Preencha seus dados para continuar
            </p>
          </div>

          <PreCadastroForm />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              termos de uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              política de privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
