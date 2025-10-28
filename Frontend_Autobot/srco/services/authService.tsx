import axios from 'axios';
import type { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

interface UserData {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    roles: string[];
}

// Cập nhật AuthResponse để có thể có hoặc không có token
interface AuthResponse {
    access_token?: string; // Có thể không có khi đăng nhập admin bước 1
    refresh_token?: string; // Có thể không có khi đăng nhập admin bước 1
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    roles: string[];
}

// Thêm interface cho phản hồi từ API verify admin login (chứa token)
interface VerifyAdminResponse extends AuthResponse {
    access_token: string;
    refresh_token: string;
}

// Constants

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5131';
const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REFRESH_TOKEN: '/api/auth/refresh-token',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  SEND_RESET_CODE: '/api/auth/send-code',
  VERIFY_RESET_CODE: '/api/auth/confirm-code',
  RESET_PASSWORD: '/api/auth/reset-password',
  SEND_REGISTER_CODE: '/api/auth/send-register-code'
};

// Cookie names
const COOKIE_NAMES = {
  USER_DATA: 'user_data',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

// Cookie expiration times (in milliseconds)
const EXPIRATION_TIMES = {
  USER_DATA: 4 * 60 * 60 * 1000, // 4 hours
  ACCESS_TOKEN: 5 * 60 * 1000,    // 5 minutes
  REFRESH_TOKEN: 24 * 60 * 60 * 1000
};

// Define frontend-friendly error messages if needed, matching backend or for display
export const ErrorMessage = {
  INVALID_TOKEN: 'INVALID_TOKEN', 
  USER_NOT_FOUND: 'USER_NOT_FOUND', 
  SERVICE_EXPIRE: 'SERVICE_EXPIRE' 
};

export class AuthService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for token refresh
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Public getter for the axios instance
  public get axios(): AxiosInstance {
    return this.axiosInstance;
  }

  // Login
  // Hàm login giờ đây có thể trả về UserData hoặc null (nếu cần bước xác thực 2 cho admin)
  async login(username: string, password: string): Promise<UserData | null> {
    try {
      const response = await this.axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
        username,
        password
      });
      console.log(response.data);

      // Kiểm tra xem phản hồi có token không
      if (response.data.access_token && response.data.refresh_token) {
        // Phản hồi có token (user thường hoặc admin đã qua bước 2)
        this.setUserData(response.data);
        const userData: UserData = {
            userId: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            roles: response.data.roles,
        };
        return userData;
      } else if (response.data.userId && response.data.roles) {
        const userData: UserData = {
            userId: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            roles: response.data.roles,
        };
        // Trả về thông tin user để frontend biết cần xác thực bước 2
        return userData; // Frontend sẽ nhận object này và biết cần bước 2
      } else {
          // Phản hồi không như mong đợi
          throw new Error('Phản hồi đăng nhập không hợp lệ');
      }

    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Hàm mới để xác thực admin với mã từ email
  async verifyAdminLogin(userId: string, token: string): Promise<UserData> {
      try {
          const response = await this.axiosInstance.post<VerifyAdminResponse>(`${API_URL}/api/auth/verifyLogin`, { // Điều chỉnh endpoint nếu cần
              userId,
              token
          });
          console.log(response.data);
          this.setUserData(response.data);
          const userData: UserData = {
              userId: response.data.userId,
              name: response.data.name,
              email: response.data.email,
              phoneNumber: response.data.phoneNumber,
              roles: response.data.roles,
          };
          return userData;
      } catch (error) {
          throw this.handleError(error);
      }
  }

  //register
  async register(name: string, email: string, phoneNumber: string, password: string, token: string): Promise<void> {
    try {
      await this.axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
        name,
        email,
        phoneNumber,
        password,
        token
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendRegisterCode(email: string): Promise<void> {
    try {
      await this.axiosInstance.post(AUTH_ENDPOINTS.SEND_REGISTER_CODE, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Send reset password code
  async sendResetCode(email: string): Promise<void> {
    try {
      await this.axiosInstance.post(AUTH_ENDPOINTS.SEND_RESET_CODE, { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify reset code
  async verifyResetCode(email: string, code: string): Promise<void> {
    try {
      await this.axiosInstance.post(AUTH_ENDPOINTS.VERIFY_RESET_CODE, {
        email,
        token: code
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    try {
      await this.axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        email,
        token: code,
        newPassword
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Refresh Token
  async refreshToken(): Promise<void> {
    try {
      console.log("[Refresh Token] Starting refresh token process");
      const refreshToken = this.getRefreshToken();
      console.log("[Refresh Token] Current refresh token exists:", !!refreshToken);
      
      if (!refreshToken) {
        console.error("[Refresh Token] No refresh token available");
        throw new Error('No refresh token available');
      }

      console.log("[Refresh Token] Calling refresh token API");
      const response = await this.axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, {
        refresh_token: refreshToken
      });
      console.log("[Refresh Token] API response received:", {
        hasAccessToken: !!response.data.access_token,
        hasRefreshToken: !!response.data.refresh_token,
        userId: response.data.userId
      });

      this.setUserData(response.data);
      console.log("[Refresh Token] New tokens set in cookies");
    } catch (error) {
      console.error("[Refresh Token] Error during refresh:", error);
      throw this.handleError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        // Optionally call backend logout endpoint if needed
        await this.axiosInstance.post(AUTH_ENDPOINTS.LOGOUT, { refresh_token: refreshToken });
        // Note: The backend logout endpoint might also invalidate the refresh token server-side
      }
    } catch (error) {
      // Handle potential errors during logout API call, but still proceed to clear data
      console.error("Error during logout API call:", error);
    } finally {
      this.clearUserData(); 
      window.location.reload();
    }
  }

  // Get current user
  getCurrentUser(): UserData | null {
    console.log(Cookies.get(COOKIE_NAMES.USER_DATA));
    const userData = Cookies.get(COOKIE_NAMES.USER_DATA);
    
    if (typeof userData !== 'string' || userData === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error("Failed to parse user data from cookie:", e);
      this.clearUserData();
      return null;
    }
  }

  // Get access token
  getAccessToken(): string | undefined {
    return Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
  }

  // Get refresh token
  private getRefreshToken(): string | undefined {
    return Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
  }

  // Set user data in cookies - giờ có thể nhận AuthResponse hoặc VerifyAdminResponse
  private setUserData(data: AuthResponse | VerifyAdminResponse): void {
    console.log("[Set User Data] Setting new user data and tokens", data);
    const userDataExpiry = new Date(new Date().getTime() + EXPIRATION_TIMES.USER_DATA);
    const tokenExpiry = new Date(new Date().getTime() + EXPIRATION_TIMES.ACCESS_TOKEN);
    const refreshTokenExpiry = new Date(new Date().getTime() + EXPIRATION_TIMES.REFRESH_TOKEN);


    if (data.userId) {
      const userToSave: UserData = {
          userId: data.userId,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          roles: data.roles,
      };
      Cookies.set(COOKIE_NAMES.USER_DATA, JSON.stringify(userToSave), { expires: userDataExpiry });
      console.log("[Set User Data] User data cookie set");
    } else {
      console.log("[Set User Data] User data not in response, keeping existing or leaving unset");
    }

    // Only set access token if it's available in the response
    if (data.access_token) {
      Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, data.access_token, { expires: tokenExpiry });
      console.log("[Set User Data] Access token cookie set");
    } else {
       console.log("[Set User Data] Access token not in response, keeping existing or leaving unset");
    }

    // Only set refresh token if it's available in the response - Backend currently doesn't return refresh token on refresh
    if (data.refresh_token) {
      Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, data.refresh_token, { expires: refreshTokenExpiry });
       console.log("[Set User Data] Refresh token cookie set");
    } else {
      console.log("[Set User Data] Refresh token not in response, keeping existing");
      // We are *not* removing the refresh token if it's not in the response
    }


    console.log("[Set User Data] Cookie expiration times used:", {
      userData: userDataExpiry,
      accessToken: tokenExpiry,
      refreshToken: refreshTokenExpiry // Note: This is the expiry for a *new* token, not the existing one if it wasn't updated
    });
  }

  // Clear user data from cookies
  private clearUserData(): void {
    Cookies.remove(COOKIE_NAMES.USER_DATA);
    Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN);
    Cookies.remove(COOKIE_NAMES.REFRESH_TOKEN);
  }

  // Handle API errors
  private handleError(error: any): Error {
    // Customize error handling based on your API response structure
    if (error.response) {
      // Check if the response data is a string (like for 400 BadRequest with simple error message)
      if (typeof error.response.data === 'string') {
        return new Error(error.response.data);
      }
      if (error.response.data && error.response.data.message) {
        return new Error(error.response.data.message);
      }
      return new Error(`Server responded with status ${error.response.status}`);
    } else if (error.message) {
      // Handle request errors (e.g., network issues)
      return new Error(error.message);
    } else {
      // Handle other unknown errors
      return new Error('An unknown error occurred.');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();