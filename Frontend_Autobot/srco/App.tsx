import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { generatePublicRoutes, generatePrivateRoutes } from './routes';
import NotFoundPage from './layouts/404Page';
import { Spin, message } from 'antd';
import { useState, createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { initialState, reducer } from './services/authReducer';
import type { AuthState } from './services/authReducer';
import { authService } from './services/authService';
import { LOGIN_SUCCESS, LOGOUT } from './services/authActions';
import { ErrorMessage } from './services/authService';

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => useContext(AuthContext);

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
export const useLoading = () => useContext(LoadingContext);

const MessageContext = createContext<ReturnType<typeof message.useMessage>[0] | undefined>(undefined);
export const useMessage = () => useContext(MessageContext);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [antMessage, contextHolder] = message.useMessage();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      dispatch({ type: LOGIN_SUCCESS, payload: { user } });
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (state.isAuthenticated) {
      intervalId = setInterval(
        async () => {
          if (authService.getCurrentUser()) {
            try {
              await authService.refreshToken();
            } catch (error: any) {

              if (error.message === 'No refresh token available' || error.response?.status === 401 || error.message.includes(ErrorMessage.INVALID_TOKEN)) {
                dispatch({ type: LOGOUT });
              } else {
                 console.log("[Auth Effect] Non-critical error during refresh.");
              }
            }
          } else {
            console.log("[Auth Effect] No current user found, clearing interval");
            if (intervalId) clearInterval(intervalId);
          }
        },
        240000, // Refresh every 4 minutes
      );
      console.log("[Auth Effect] Interval set up with ID:", intervalId);
    } else {
      console.log("[Auth Effect] User not authenticated, clearing interval if exists");
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      console.log("[Auth Effect] Cleanup - clearing interval");
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.isAuthenticated, dispatch, antMessage]); // Added dispatch and antMessage to dependencies

  return (  
    <MessageContext.Provider value={antMessage}>
      {contextHolder}
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        <AuthContext.Provider value={{ state, dispatch }}>
          <Spin spinning={isLoading} fullscreen />
          <Router>
            <Routes>
              {generatePublicRoutes(state.isAuthenticated)}
              {generatePrivateRoutes(state.isAuthenticated)}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </LoadingContext.Provider>
    </MessageContext.Provider>
  );
}

export default App
