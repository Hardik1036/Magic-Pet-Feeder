import React from 'react';
import MagicPetFeeder from './components/MagicPetFeeder.jsx';

export default function App() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full h-full max-w-md mx-auto shadow-2xl relative overflow-hidden">
        <MagicPetFeeder />
      </div>
    </div>
  );
}
