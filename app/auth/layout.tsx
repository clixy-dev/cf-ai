import React from 'react';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
      style={{ backgroundImage: 'url(/bg.png)' }}
    >
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-[32px] p-8">
        <div className="-mt-4">
          {children}
        </div>
      </div>
    </div>
  );
} 