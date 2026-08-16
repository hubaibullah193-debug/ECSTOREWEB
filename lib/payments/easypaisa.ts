import crypto from 'crypto';

interface EasypaisaPaymentRequest {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

interface EasypaisaPaymentResponse {
  storeId: string;
  authToken: string;
  transactionId: string;
  transactionAmount: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  orderReferenceNumber: string;
  returnUrl: string;
  requestChecksum: string;
}

export function generateEasypaisaChecksum(data: string): string {
  const authToken = process.env.EASYPAISA_AUTH_TOKEN || '';
  return crypto
    .createHash('sha256')
    .update(data + authToken)
    .digest('hex');
}

export function createEasypaisaPaymentRequest(
  request: EasypaisaPaymentRequest
): EasypaisaPaymentResponse {
  const storeId = process.env.EASYPAISA_STORE_ID || '';
  const authToken = process.env.EASYPAISA_AUTH_TOKEN || '';
  const transactionId = `EP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const checksumData = [
    storeId,
    transactionId,
    request.totalAmount.toString(),
    request.customerName,
    request.customerEmail,
    request.customerPhone,
    request.orderNumber,
  ].join('|');

  const checksum = generateEasypaisaChecksum(checksumData);

  return {
    storeId,
    authToken,
    transactionId,
    transactionAmount: request.totalAmount.toString(),
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    customerPhoneNumber: request.customerPhone,
    orderReferenceNumber: request.orderNumber,
    returnUrl: request.returnUrl,
    requestChecksum: checksum,
  };
}

export function verifyEasypaisaResponse(responseData: Record<string, string>): boolean {
  const receivedChecksum = responseData.responseChecksum;
  const authToken = process.env.EASYPAISA_AUTH_TOKEN || '';

  const checksumData = [
    responseData.transactionId,
    responseData.transactionStatus,
    responseData.transactionAmount,
  ].join('|');

  const calculatedChecksum = crypto
    .createHash('sha256')
    .update(checksumData + authToken)
    .digest('hex');

  return receivedChecksum === calculatedChecksum;
}

export function parseEasypaisaResponse(queryParams: Record<string, any>) {
  return {
    transactionId: queryParams.transactionId,
    orderReference: queryParams.orderReferenceNumber,
    status: queryParams.transactionStatus === '1' ? 'success' : 'failed',
    amount: queryParams.transactionAmount ? parseFloat(queryParams.transactionAmount) : 0,
    description: queryParams.transactionStatusDescription,
    timestamp: queryParams.transactionDatetime,
  };
}
