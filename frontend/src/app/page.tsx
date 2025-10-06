import Home from '@/components/Home/Home';
import React from 'react';
import Menu from '@/components/Navigation/Menu';

export default function Page() {
  
  return (
    <div className="w-full">
      <Menu />
      <Home />
    </div>
  )
  
}