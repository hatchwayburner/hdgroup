import React, {useState} from 'react';

async function sendAccountData(email, password, image) {
    var data = new FormData();
    data.append('image', image);
    data.append('email', email);
    data.append('password', password);
    return fetch('api/create', {
      method: 'POST',
      body: data
    })
      .then(data => data.json())
}

export default function CreateUser({setSessionToken, setSessionEmail}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [image, setImage] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await sendAccountData(email, password, image);
        alert(response.msg);
        if ("created" in response) {
            window.location.replace("/signin");
        }
    }

    return (
        <div className="createuser-wrapper">
        <h1>Create User</h1>
        <form id='form' onSubmit={handleSubmit}>
          <label>
            <p>Email</p>
            <input type="text" onChange={e => setEmail(e.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input type="password" onChange={e => setPassword(e.target.value)}/>
          </label>
          <label>
            <p>Image</p>
            <input type="file" name="file" onChange={e => setImage(e.target.files[0])}/>
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
}