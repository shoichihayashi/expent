import React, { useState, useEffect } from 'react';
import bg from '../../img/bg.png';
import styled from 'styled-components';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure this import is correct
import { useAuth } from '../../context/AuthContext'; // Ensure this import is correct

function Homepage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth(); // Ensure you get setAuth from the context

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log('Login Success:', codeResponse);

      // Exchange authorization code for tokens
      axios.post('http://localhost:5000/api/v1/google-login', {
        code: codeResponse.code
      })
        .then((response) => {
          console.log('Tokens received:', response.data);
          setUser(response.data);
          setAuth({ token: response.data.id_token, user: response.data.user }); // Set the auth context
        })
        .catch((err) => {
          console.log('Error exchanging code for tokens:', err);
        });
    },
    onError: (error) => {
      console.log('Login Failed:', error);
    },
    flow: 'auth-code',
  });

  useEffect(() => {
    if (user && user.id_token) {
      const decoded = jwtDecode(user.id_token)
      setProfile(decoded);

      // Save user to the database
      axios.post('http://localhost:5000/api/v1/save-user', {
        id_token: user.id_token
      })
        .then((response) => {
          console.log('User saved to the database:', response.data);
          navigate('/userpage', { state: { profile: response.data } });
        })
        .catch((err) => {
          console.log('Error saving user to the database:', err);
        });
    }
  }, [user, navigate]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setAuth({ token: null, user: null });
    navigate('/');
  };

  return (
    <HomepageStyled bg={bg} className="Homepage">
      <h1>Welcome to Expent!</h1>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={login}>Sign in with Google 🚀</button>
      )}
    </HomepageStyled>
  );
}

const HomepageStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1, button {
    margin-bottom: 10px;
  }

  button {
    height: 10%;
    width: 20%;
    font-size: 24px;
  }
`;

export default Homepage;
