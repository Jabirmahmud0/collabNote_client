import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
      <div className="mesh-bg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        {/* Animated 404 */}
        <motion.div
          className="text-[120px] md:text-[160px] font-extrabold tracking-tighter leading-none text-gradient mb-4 select-none"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.div>

        <h2 className="text-xl font-bold text-text-primary mb-2">
          Page not found
        </h2>
        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>

        <Button onClick={() => navigate('/dashboard')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
