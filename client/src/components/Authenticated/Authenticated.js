import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';

async function getImage(email, tokenString) {
    return fetch('api/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"email": email, "tokenString": tokenString})
    }) //blob because it is an image
      .then(data => data.blob())
   }

export default function Authenticated({sessionToken, sessionEmail}) {
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState();

    const loadImage = async function() {
        const response = await getImage(sessionEmail, sessionToken.string);
        //creates image from blob object
        setImageSrc(URL.createObjectURL(response))
    };

    useEffect(() => {
        //redirect if not signed in
        if ((!sessionToken) || (!sessionEmail)) return navigate('/signin');
        //retrieve image on page load
        loadImage();
    }, [sessionToken, sessionEmail, navigate]);

    return (
        <div className="authenticated-wrapper">
            <p>Email: {sessionEmail}</p>
            <div>
                <img src={imageSrc} alt="Your File" />
            </div>
        </div>
    );
}

Authenticated.propTypes = {
    sessionToken: PropTypes.object.isRequired,
    sessionEmail: PropTypes.string.isRequired
  }