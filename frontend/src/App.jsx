import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import AgentLanding from './pages/agent/AgentLanding';
import PlanShopper from './pages/agent/PlanShopper';
import AgentBenefitInquiry from './pages/agent/BenefitInquiry';
import MemberLanding from './pages/member/MemberLanding';
import MemberBenefitInquiry from './pages/member/BenefitInquiry';
import MedicalCodeExtraction from './pages/payer/MedicalCodeExtraction';
import StarRatingAnalysis from './pages/payer/StarRatingAnalysis';
import ProtectedRoute from './components/ProtectedRoute';
import PayerRoute from './components/PayerRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/landing" 
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent/landing" 
          element={
            <ProtectedRoute>
              <AgentLanding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent/plan-shopper" 
          element={
            <ProtectedRoute>
              <PlanShopper />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agent/benefit-inquiry" 
          element={
            <ProtectedRoute>
              <AgentBenefitInquiry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/member/landing" 
          element={
            <ProtectedRoute>
              <MemberLanding />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/member/benefit-inquiry" 
          element={
            <ProtectedRoute>
              <MemberBenefitInquiry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payer/medical-code-extraction" 
          element={
            <PayerRoute>
              <MedicalCodeExtraction />
            </PayerRoute>
          } 
        />
        <Route 
          path="/payer/star-rating-analysis" 
          element={
            <PayerRoute>
              <StarRatingAnalysis />
            </PayerRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;