
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { ArrowRight } from 'lucide-react';

const IntroPage = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout showHeader={false}>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 to-electric-blue-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-purple-300 rounded-full filter blur-3xl" />
          <div className="absolute top-[60%] right-[15%] w-72 h-72 bg-electric-blue-300 rounded-full filter blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10 flex flex-col items-center justify-center min-h-screen">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-700 to-electric-blue-600 bg-clip-text text-transparent">
              Welcome to VoiceShop
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Your AI-powered shopping assistant is ready to help you find the perfect fitness gear
            </p>
            
            <div className="mb-12 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-electric-blue-600 mx-auto flex items-center justify-center shadow-lg">
                <div className="text-white text-4xl">AI</div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 italic">
                  "Hi there! I'm your personal shopping assistant."
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Button 
                className="btn-primary w-full sm:w-auto text-lg"
                onClick={() => navigate('/categories')}
              >
                Get Started <ArrowRight className="ml-2" size={18} />
              </Button>
              
              <p className="text-sm text-gray-500">
                Use the voice assistant at the bottom right to navigate by voice
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IntroPage;
