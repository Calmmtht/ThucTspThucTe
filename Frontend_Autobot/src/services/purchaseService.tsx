import axios from 'axios';
import { authService } from './authService'; // Import authService

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5131';
// Interfaces
export interface PurchaseHistory {
    id: number;
    priceBot: number;
    startDate: Date;
    endDate: Date;
    paymentMethod: string;
    status: string;
    date: Date;
    userId: string;
}

export interface PurchaseHistoryCreate {
    priceBot: number;
    startDate: Date;
    endDate: Date;
    paymentMethod: string;
    status: string;
    date: Date;
    userId: string;
}

export interface PurchaseHistoryResponse {
    purchases: PurchaseHistory[];
    total: number;
}
// Service class
export class PurchaseService {
    private baseUrl: string;
    private readonly axiosInstance = authService.axios; // Use the authenticated axios instance

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    // Add a new purchase history
    async addPurchaseHistory(purchase: PurchaseHistoryCreate): Promise<PurchaseHistory> {
        try {
            const response = await this.axiosInstance.post(`${this.baseUrl}/api/purchaseHistory/add`, purchase);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get all purchase histories for a user
    async getAllPurchasesByUser(userId: string): Promise<PurchaseHistoryResponse> {
        try {
            const response = await this.axiosInstance.get(`${this.baseUrl}/api/purchaseHistory/getPurchaseAllByUser`, {
                params: { userId }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Get purchase histories for a specific month
    async getPurchasesByMonth(userId: string, month: number, year?: number): Promise<PurchaseHistoryResponse> {
        try {
            const response = await this.axiosInstance.get(`${this.baseUrl}/api/purchaseHistory/getPurchaseMonthByUser`, {
                params: { userId, month, year }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getPurchasesByYear(userId: string, year?: number): Promise<PurchaseHistoryResponse> {
        try {
            const response = await this.axiosInstance.get(`${this.baseUrl}/api/purchaseHistory/getPurchaseYearByUser`, {
                params: { userId, year }
            });
            return response.data;
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