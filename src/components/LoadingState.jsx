// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Users } from 'lucide-react';

export function LoadingState() {
  return <div className="min-h-screen bg-black text-white p-4 md:p-6 flex items-center justify-center">
    <div className="text-center">
      <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
      <p className="text-gray-400">加载智能体中...</p>
    </div>
  </div>;
}