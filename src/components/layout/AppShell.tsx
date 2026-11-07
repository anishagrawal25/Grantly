import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-900 selection:bg-brand-100 selection:text-brand-700">
      <TopNav />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};
