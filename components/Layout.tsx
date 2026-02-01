
import React from 'react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{APP_NAME}</h1>
            <p className="text-xs text-teal-600 font-medium tracking-wide">استشاري طب الأسنان الذكي</p>
          </div>
        </div>
        <div className="flex gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                <span className="w-1 h-1 bg-teal-500 rounded-full ml-1 animate-pulse"></span>
                متاح الآن
            </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
        {children}
      </main>

      <footer className="py-4 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        © {new Date().getFullYear()} {APP_NAME}. جميع الاستشارات هي دعم للقرار وليست بديلاً عن الفحص السريري.
      </footer>
    </div>
  );
};

export default Layout;
