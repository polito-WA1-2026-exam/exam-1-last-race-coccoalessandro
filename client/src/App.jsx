import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import Header from './components/Header.jsx';
import LoginForm from './components/LoginForm.jsx';
import GameManager from './components/GameManager.jsx';
import Instructions from './components/Instructions.jsx';
import Ranking from './components/Ranking.jsx';

import UserContext from './contexts/UserContext.js';
import {checkSession, doLogout, doLogin} from './api/auth.js';

import './App.css'

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState( {id: undefined, username: undefined} );

  useEffect(() => {
    checkSession().then(result => {
      if (result) {
        setUser( {id: result.id, username: result.username} );
      }
    })
  }, []);

  const handleLogin = (newUser) => {
    setUser( {id: newUser.id, username: newUser.username} );
    navigate('/play'); // go to GameManager
  }

  const handleLogout = async () => {
    await doLogout();
    setUser( {id: undefined, username: undefined} );
    navigate('/');
  }

  return (
    <UserContext.Provider value = {user}>
        <Routes>
          <Route path = '/'element = {<MainLayout handleLogout = {handleLogout}/>}>
            <Route index element = {<InstructionsView />}/>
            <Route path = 'login' element = {<LoginView doLogin = {handleLogin}/>}/>
            <Route path = 'play' element = {<PlayView />}/>
            <Route path = 'ranking' element = {<RankingView/>}/>
            <Route path = 'error' element = {<h1>"Something went wrong"</h1>}/>
            <Route path = '*' element = {<Navigate to = "/"/>}/>
          </Route>
        </Routes>
    </UserContext.Provider>
  )
}

function MainLayout(props) {
  return (
    <>
      <Header handleLogout = {props.handleLogout}/>
      <Container>
        <Outlet />
      </Container>
    </>
  )
}

function InstructionsView() {
  return <Instructions/>
}

function LoginView(props) {
  const user = useContext(UserContext);
  if (user.id)return <Navigate to = '/play'/>;
  return <LoginForm doLogin = {props.doLogin} />
}

function PlayView() {
  const user = useContext(UserContext);
  if (!user.id) return <Navigate to = '/'/>

  return <GameManager/>
}

function RankingView() {
  const user = useContext(UserContext);
  if (!user.id) return <Navigate to = '/'/>
  return <Ranking/>
}

export default App
