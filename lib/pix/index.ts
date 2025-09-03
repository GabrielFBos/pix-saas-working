import { IPixGateway } from './IPixGateway';
import { MockPixGateway } from './MockPixGateway';
import { env } from '@/lib/env';

// Factory para criar o gateway PIX baseado na configuração
export function getPixGateway(): IPixGateway {
  switch (env.PIX_PROVIDER) {
    case 'mock':
      return new MockPixGateway();
    
    case 'efi':
      // TODO: Implementar EfiPixGateway
      throw new Error('Gateway EFI não implementado ainda');
    
    case 'mp':
      // TODO: Implementar MPPixGateway
      throw new Error('Gateway MP não implementado ainda');
    
    default:
      throw new Error(`Provedor PIX não suportado: ${env.PIX_PROVIDER}`);
  }
}

// Exporta os tipos e classes para uso externo
export type { IPixGateway };
export { MockPixGateway };
