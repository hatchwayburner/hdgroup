import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Authenticated from './components/Authenticated/Authenticated';
import CreateUser from './components/CreateUser/CreateUser';
import SignIn from './components/SignIn/SignIn';

function App() {
  return(
    <div className="wrapper">
      <h1>Test</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/authenticated" element={<Authenticated />}></Route>
          <Route path="/createuser" element={<CreateUser />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
