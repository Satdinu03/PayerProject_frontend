import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const AboutUs = () => {
  const [searchParams] = useSearchParams();
  const role = localStorage.getItem('role') || 'member';
  const section = searchParams.get('section');

  const content = {
    member: {
      'our-mission': {
        title: 'Our Mission',
        content: 'DineshHealth is committed to providing comprehensive, affordable healthcare coverage to all members. We focus on preventive care, wellness programs, and ensuring access to quality medical services nationwide.',
        details: [
          'Founded in 1995 with a vision to make healthcare accessible to everyone',
          'Serving over 2.5 million members across 45 states',
          'Committed to preventive care and early intervention programs',
          'Partnership with leading medical institutions and research centers',
          'Focus on community health initiatives and wellness education'
        ],
        icon: '🎯'
      },
      'member-benefits': {
        title: 'Member Benefits',
        content: 'Enjoy comprehensive coverage designed with your health and financial well-being in mind.',
        details: [
          '$0 copays for preventive care including annual checkups and screenings',
          '24/7 telemedicine services with board-certified physicians',
          'Prescription drug coverage with preferred pharmacy network',
          'Dental and vision plans with nationwide provider networks',
          'Wellness rewards program with up to $500 annual incentives',
          'Mobile app for claims management, provider search, and health tracking',
          'Mental health services including counseling and therapy',
          'Maternity and newborn care with comprehensive support programs'
        ],
        icon: '💎'
      },
      'network-providers': {
        title: 'Network Providers',
        content: 'Access to the largest healthcare network in the country with quality providers.',
        details: [
          '50,000+ healthcare providers nationwide',
          '1,200+ hospitals including top-rated medical centers',
          '15,000+ specialists across all medical disciplines',
          '8,000+ urgent care and walk-in clinics',
          '25,000+ pharmacies with 24/7 prescription services',
          'Online provider directory with real-time availability',
          'Quality ratings and patient reviews for informed decisions',
          'Telehealth options available for most specialties'
        ],
        icon: '🏥'
      }
    },
    agent: {
      'agent-portal': {
        title: 'Agent Portal',
        content: 'Comprehensive digital platform designed specifically for insurance agents.',
        details: [
          'Client management system with complete customer profiles',
          'Real-time enrollment processing and application tracking',
          'Commission tracking with detailed earnings reports',
          'Policy management tools for renewals and changes',
          '24/7 portal access with mobile-responsive design',
          'Automated notifications for important deadlines',
          'Document management and digital signature capabilities',
          'Integration with CRM systems and marketing tools'
        ],
        icon: '💼'
      },
      'training-center': {
        title: 'Training Center',
        content: 'Professional development resources to enhance your insurance expertise.',
        details: [
          'Comprehensive certification courses for new agents',
          'Monthly webinars on industry trends and regulations',
          'Product training materials updated quarterly',
          'Continuing education credits for license maintenance',
          'New agent onboarding program with dedicated mentorship',
          'Sales technique workshops and best practices sessions',
          'Compliance training to ensure regulatory adherence',
          'Advanced courses for specialized insurance products'
        ],
        icon: '📚'
      },
      'commission-structure': {
        title: 'Commission Structure',
        content: 'Competitive compensation program designed to reward performance and growth.',
        details: [
          'First-year commissions up to 15% of premium value',
          'Renewal commissions up to 8% for retained clients',
          'Performance bonuses for exceeding quarterly targets',
          'Annual recognition programs with cash rewards',
          'Volume-based tier system with increasing commission rates',
          'Special incentives for new product launches',
          'Override commissions for team leaders and managers',
          'Profit-sharing program for top-performing agents'
        ],
        icon: '💰'
      }
    }
  };

  const currentContent = content[role];
  const selectedSection = section ? currentContent[section] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About DineshHealth</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Leading the future of healthcare with innovative solutions and compassionate care</p>
        </div>
        
        {selectedSection ? (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">{selectedSection.icon}</div>
                <h2 className="text-4xl font-bold text-blue-600 mb-4">{selectedSection.title}</h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">{selectedSection.content}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {selectedSection.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-6 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {Object.entries(currentContent).map(([key, item]) => (
              <div key={key} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.content}</p>
                </div>
                <div className="space-y-3">
                  {item.details.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <p className="text-sm text-gray-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;