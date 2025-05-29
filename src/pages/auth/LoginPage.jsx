import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { LogIn } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(`${role}@example.com`, 'password');
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <Input
            id="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <div className="login-options">
          <div className="remember-me">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="remember-checkbox"
            />
            <label htmlFor="remember-me" className="remember-label">
              Remember me
            </label>
          </div>

          <div className="forgot-password">
            <a href="#" className="forgot-link">
              Forgot your password?
            </a>
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span>{error}</span>
          </div>
        )}

        <div>
          <Button
            type="submit"
            className="login-button"
            isLoading={isLoading}
            icon={<LogIn size={18} />}
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="quick-login-container">
        <div className="quick-login-divider">
          <div className="divider-line"></div>
          <div className="divider-text">
            <span>Quick login for demo</span>
          </div>
        </div>

        <div className="quick-login-buttons">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin('management')}
            disabled={isLoading}
            className="quick-login-button"
          >
            Management
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin('trainer')}
            disabled={isLoading}
            className="quick-login-button"
          >
            Trainer
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickLogin('store')}
            disabled={isLoading}
            className="quick-login-button"
          >
            Storekeeper
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;