import crypto from 'crypto';

interface JazzCashPaymentRequest {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

interface JazzCashResponse {
  pp_MerchantID?: string;
  pp_Password?: string;
  pp_BillReference?: string;
  pp_Amount?: string;
  pp_TxnCurrency?: string;
  pp_TxnExpiryTime?: string;
  pp_ReturnURL?: string;
  pp_TxnType?: string;
  pp_SecureHash?: string;
  pp_Language?: string;
  pp_IsExpressCheckout?: string;
  pp_BillDesc?: string;
  pp_CustomerEmail?: string;
  pp_CustomerMobileNumber?: string;
  pp_CustomerName?: string;
}

export function generateJazzCashHash(params: Record<string, string>): string {
  const salt = process.env.JAZZCASH_SALT_VALUE || '';
  const sortedKeys = Object.keys(params).sort();

  let hashString = salt;
  for (const key of sortedKeys) {
    hashString += params[key];
  }
  hashString += salt;

  return crypto
    .createHash('sha256')
    .update(hashString)
    .digest('hex')
    .toUpperCase();
}

export function createJazzCashPaymentRequest(
  request: JazzCashPaymentRequest
): JazzCashResponse {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID || '';
  const password = process.env.JAZZCASH_PASSWORD || '';
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[:\-]/g, '')
    .slice(0, 14);

  const params: Record<string, string> = {
    pp_MerchantID: merchantId,
    pp_Password: password,
    pp_BillReference: request.orderNumber,
    pp_Amount: (request.totalAmount * 100).toString(), // Convert to cents
    pp_TxnCurrency: 'PKR',
    pp_TxnExpiryTime: expiryTime,
    pp_ReturnURL: request.returnUrl,
    pp_TxnType: 'MWALLET',
    pp_Language: 'EN',
    pp_IsExpressCheckout: 'N',
    pp_BillDesc: `Order ${request.orderNumber}`,
    pp_CustomerEmail: request.customerEmail,
    pp_CustomerMobileNumber: request.customerPhone.replace(/\D/g, ''),
    pp_CustomerName: request.customerName,
  };

  const hash = generateJazzCashHash(params);

  return {
    ...params,
    pp_SecureHash: hash,
  };
}

export function verifyJazzCashResponse(responseData: Record<string, string>): boolean {
  const receivedHash = responseData.pp_SecureHash;

  // Remove the hash from params for verification
  const params = { ...responseData };
  delete params.pp_SecureHash;

  const calculatedHash = generateJazzCashHash(params);

  return receivedHash === calculatedHash;
}

export function parseJazzCashResponse(queryParams: Record<string, any>) {
  return {
    orderReference: queryParams.pp_BillReference,
    transactionId: queryParams.pp_TxnRefNo,
    status: queryParams.pp_ResponseCode === '0' ? 'success' : 'failed',
    amount: queryParams.pp_Amount ? parseInt(queryParams.pp_Amount) / 100 : 0,
    description: queryParams.pp_ResponseDesc,
    timestamp: queryParams.pp_TxnDateTime,
  };
}
