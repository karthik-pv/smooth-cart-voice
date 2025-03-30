
import React, { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  transparentHeader?: boolean;
}

export const Layout = ({ 
  children, 
  showHeader = true, 
  transparentHeader = false 
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header transparent={transparentHeader} />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
