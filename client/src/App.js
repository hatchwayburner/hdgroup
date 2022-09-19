import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Authenticated from './components/Authenticated/Authenticated';
import CreateUser from './components/CreateUser/CreateUser';
import SignIn from './components/SignIn/SignIn';
import {setSessionToken, getSessionToken, setSessionEmail, getSessionEmail} from './components/Session/Session'

function App() {
  //authentication
  const sessionToken = getSessionToken();
  const sessionEmail = getSessionEmail();

  return(
    <div className="wrapper">
      <h1>Test</h1>
      <a href='/createuser'>Create User</a><br></br>
      <a href='/signin'>Sign In</a><br></br>
      <a href='/authenticated'>Authenticated</a><br></br>
      <BrowserRouter>
        <Routes>
          <Route path={"/authenticated"} element={<Authenticated sessionToken={sessionToken} sessionEmail={sessionEmail}/>}></Route>
          <Route path="/createuser" element={<CreateUser />}></Route>
          <Route path="/signin" element={<SignIn setSessionToken={setSessionToken} setSessionEmail={setSessionEmail}/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
