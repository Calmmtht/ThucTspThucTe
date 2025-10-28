import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5131';
import { authService } from './authService';
export interface PaymentRequest {
    userId: string;
    month: number;
    botTradingId: number;
    returnUrl: string;
    cancelUrl: string;
}



export class PaymentService {
    private baseUrl: string;
    private readonly axiosInstance = authService.axios;
    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Tạo payment link để thanh toán
    async createPaymentLink(request: PaymentRequest) {
        try {
            const response = await this.axiosInstance.post(`${this.baseUrl}/api/payments/create-payment-link`, request);
            return response;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Kiểm tra trạng thái thanh toán
    async checkPayment(userId: string): Promise<void> {
        try {
            await this.axiosInstance.get(`${this.baseUrl}/api/payments/check-payment/${userId}`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handler
    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            return new Error(error.response?.data?.message || error.message);
        }
        return error;
    }
}

export const paymentService = new PaymentService();