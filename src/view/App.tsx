import { Outlet } from 'react-router-dom';
import './App.css';
import NavBar from './navigation/navigationBar';

function App() {
  return <>
    <NavBar />
    <Outlet />
  </>;
}

export default App;
