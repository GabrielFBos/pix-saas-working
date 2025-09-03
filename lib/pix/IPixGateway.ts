import { NextRequest } from 'next/server';
import { CreateChargeRequest, CreateChargeResponse, StatusResponse } from '@/lib/validation';

// Interface para gateway PIX
export interface IPixGateway {
  createCharge(_data: CreateChargeData): Promise<PixCharge>;
  verifyPayment(_txid: string): Promise<PixStatus>;
  handleWebhook(_req: Request): Promise<void>;
}
