import React, { Component } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HostelList from './Component/hostel';
import EstateLogin from './Component/login';
import StudentUpdatePage from './Component/updatehosteldetail';
import AuthCallback from './Component/AuthCallback';

class App extends Component {
  render() {
    return (
      <Routes>
        <Route path='/' element={<EstateLogin />} />
        <Route path='/auth/callback' element={<AuthCallback />} />
        <Route path='/Home' element={<HostelList />} />
        <Route path='/Home/update' element={<StudentUpdatePage />} />
      </Routes>
    );
  }
}

export default App;
