
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BadgeCheck, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const orderNumber = "ORD" + Math.floor(100000 + Math.random() * 900000);
  
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <BadgeCheck className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your order is confirmed!</h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. We've received your order and will begin processing it right away.
          </p>
          
          <div className="bg-background border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Order Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">customer@example.com</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">Credit Card</p>
              </div>
            </div>
            
            <div className="text-left">
              <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
              <p className="font-medium">John Doe</p>
              <p className="text-gray-700">123 Main Street</p>
              <p className="text-gray-700">San Francisco, CA 94103</p>
              <p className="text-gray-700">United States</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              You will receive a confirmation email with your order details and tracking information once your order ships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button 
                onClick={() => navigate('/products/all')}
                className="flex gap-2 items-center"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex gap-2 items-center"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
