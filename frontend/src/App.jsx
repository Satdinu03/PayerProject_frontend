import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import AgentLanding from './pages/agent/AgentLanding';
import PlanShopper from './pages/agent/PlanShopper';
import BenefitInquiry from './pages/agent/BenefitInquiry';
import MemberLanding from './pages/member/MemberLanding';
import MemberBenefitInquiry from './pages/member/BenefitInquiry';
import MedicalCodeExtraction from './pages/payer/MedicalCodeExtraction';
import StarRatingAnalysis from './pages/payer/StarRatingAnalysis';
import ProtectedRoute from './components/ProtectedRoute';
import PayerRoute from './components/PayerRoute';
import MemberRoute from './components/MemberRoute';

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
              <BenefitInquiry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/member/landing" 
          element={
            <MemberRoute>
              <MemberLanding />
            </MemberRoute>
          } 
        />
        <Route 
          path="/member/benefit-inquiry" 
          element={
            <MemberRoute>
              <MemberBenefitInquiry />
            </MemberRoute>
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