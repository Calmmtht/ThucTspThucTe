import { authService } from './authService';
import { LOGIN_SUCCESS, LOGOUT } from './authActions'; // Import action types

// Define interface for authentication state
export interface AuthState {
  isAuthenticated: boolean;
  roles: string[];
  // Add other state properties here if any
  user?: any; // Add user property here as it's used in the reducer payload
}

// Define initial state for authentication
const user = authService.getCurrentUser();
export const initialState: AuthState = {
  isAuthenticated: !!user, // Use boolean conversion
  roles: user?.roles || [], // Use optional chaining and default to empty array
  user: user, // Include user in initial state
};

// Define reducer for authentication state
export const reducer = (state: AuthState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case LOGIN_SUCCESS: // Use imported action type
      return {
        ...state,
        isAuthenticated: true,
        roles: action.payload?.user?.roles || [], // Assuming payload structure from authService.setUserData
        user: action.payload?.user, // Store user object in state
      };
    case LOGOUT: // Use imported action type
      return {
        ...state,
        isAuthenticated: false,
        roles: [],
        user: null, // Clear user on logout
      };
    // Add other action types if needed
    default:
      return state;
  }
}; 