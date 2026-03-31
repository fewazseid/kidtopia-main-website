import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const MinimalHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-green/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-brand-green/5 rounded-full transition-colors text-brand-green"
            title="Go Back"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex flex-col justify-center"
          >
            <div className="font-sans font-bold text-2xl tracking-tighter flex">
              <span className="text-brand-orange">K</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">D</span>
              <span className="text-brand-teal">T</span>
              <span className="text-brand-tan">O</span>
              <span className="text-brand-orange">P</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">A</span>
            </div>
            <span className="text-[8px] font-sans text-brand-green font-medium tracking-wide mt-[-4px] hidden sm:block">
              International Daycare and Preschool
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
