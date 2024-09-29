import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import bg from '../../img/bg.png';
import { MainLayout } from '../../styles/Layouts';
import Navigation from '../Navigation/Navigation';
import Dashboard from '../Dashboard/Dashboard';
import Incomes from '../Incomes/Incomes';
import Expenses from '../Expenses/Expenses';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Userpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = location.state || {};
  const { auth, setAuth } = useAuth(); // Ensure you get auth and setAuth from the context

  const [active, setActive] = useState(1);
  const [error, setError] = useState(null); // State to store error messages

  console.log("auth in Userpage.js: ", auth)

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />;
      case 3:
        return <Incomes />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        };
        // Fetch data here using your functions like getIncomes, getExpenses, etc.
        // Ensure that you handle any errors in these functions as well
        // Example: await getIncomes(config);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
        // Redirect or handle the error as needed
        if (err.response && err.response.status === 401) {
          setAuth(null);
          navigate('/');
        }
      }
    };

    fetchData();
  }, [auth, navigate, setAuth]);

  return (
    <UserpageStyled bg={bg} className="Userpage">
      <MainLayout>
        <Navigation active={active} setActive={setActive} profile={profile} />
        <main>
          {error ? <p className="error">{error}</p> : displayData()}
        </main>
      </MainLayout>
    </UserpageStyled>
  );
}

const UserpageStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .error {
    color: red;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 2rem;
  }
`;

export default Userpage;
