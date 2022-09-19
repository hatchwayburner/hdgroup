import React, {useState} from 'react';
import PropTypes from 'prop-types';

async function loginUser(email, password) {
    return fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"email": email, "password": password})
    })
      .then(data => data.json())
   }

export default function SignIn({setSessionToken, setSessionEmail}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser(email, password);
        if ("token" in response) {
            setSessionToken(response.token);
            setSessionEmail(email);
            console.log(response.token);
            window.location.replace("/authenticated");
        }
        else alert(response.msg);
    }

    return (
        <div className="signin-wrapper">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Email</p>
            <input type="text" onChange={e => setEmail(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
}

SignIn.propTypes = {
    setSessionToken: PropTypes.func.isRequired,
    setSessionEmail: PropTypes.func.isRequired
  }