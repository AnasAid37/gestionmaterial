import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-2 text-base text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
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
