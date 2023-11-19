import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import { Route,Routes, Navigate  } from 'react-router-dom'

function App() {

 
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  );
};

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup/>} />  
        <Route path="/login" element={<Login/>} />  
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      </Routes>
      
    </>
  );
}

export default App;
