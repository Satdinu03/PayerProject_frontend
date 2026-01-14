import { Navigate } from 'react-router-dom';

const PayerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  if (role !== 'payer') {
    return <Navigate to="/landing" replace />;
  }
  
  return children;
};

export default PayerRoute;