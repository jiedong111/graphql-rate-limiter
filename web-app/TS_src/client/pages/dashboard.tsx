import React, { useState } from 'react';
import useStore from '../store';
import Navbar from '../components/Navbar';
import SocketIoTest from '../components/SocketIoTest';

const Dashboard: React.FC<{}> = () => {
  const { showLogin, showRegistration } = useStore();
  
  
  return (
    <>
      <Navbar />
      <div>
        <h1>Dashboard!</h1>
        <SocketIoTest />
      </div>
    </>
    
  );
}

export default Dashboard;