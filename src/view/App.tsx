import { Outlet } from 'react-router-dom';
import './App.css';
import ReadingGraph from './graph/readingGraph';

function App() {
  return <>
    <Outlet />
  </>;
}

export default App;
