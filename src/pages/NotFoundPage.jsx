// NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-wrapper">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page not found</h2>
          <p className="error-message">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="button-container">
            <Button
              as={Link}
              to="/"
              icon={<Home size={18} />}
            >
              Go home
            </Button>
            <Button
              variant="outline"
              icon={<ArrowLeft size={18} />}
              onClick={() => window.history.back()}
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;