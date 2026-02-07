import { useSearchParams } from 'react-router-dom';

const FAQ = () => {
  const [searchParams] = useSearchParams();
  const role = localStorage.getItem('role') || 'member';
  const section = searchParams.get('section');

  const content = {
    member: {
      'file-claim': {
        title: 'How to file a claim?',
        content: 'Filing a claim with DineshHealth is simple and can be done through multiple convenient methods.',
        steps: [
          'Log into your member portal at dineshhealth.com/login',
          'Navigate to the "Claims" section and click "File New Claim"',
          'Upload required documents (receipts, medical records, prescriptions)',
          'Fill out the claim form with accurate provider and service information',
          'Submit your claim and receive a confirmation number',
          'Track your claim status in real-time through the portal',
          'Receive payment via direct deposit or check within 5-7 business days'
        ],
        tips: [
          'Keep all original receipts and medical documentation',
          'File claims within 90 days of service for faster processing',
          'Use our mobile app for quick photo uploads of receipts',
          'Set up direct deposit for faster reimbursement',
          'Contact member services if you need assistance with complex claims'
        ],
        icon: '📄'
      },
      'find-doctor': {
        title: 'How to find a doctor?',
        content: 'Finding the right healthcare provider in our network is easy with multiple search options.',
        steps: [
          'Visit dineshhealth.com/providers or use our mobile app',
          'Enter your location (zip code, city, or address)',
          'Select the type of provider (primary care, specialist, hospital)',
          'Filter by specialty, gender, languages spoken, and availability',
          'Review provider profiles, ratings, and patient reviews',
          'Check real-time appointment availability',
          'Book appointments directly through the platform or call the office'
        ],
        tips: [
          'All in-network providers accept your DineshHealth plan',
          'Use the "Find Care Now" feature for urgent needs',
          'Read patient reviews and quality ratings before choosing',
          'Consider telehealth options for routine consultations',
          'Save favorite providers to your profile for easy access'
        ],
        icon: '👨⚕️'
      },
      'coverage-questions': {
        title: 'Coverage questions?',
        content: 'Understanding your coverage is important for making informed healthcare decisions.',
        steps: [
          'Review your Summary of Benefits document (available in member portal)',
          'Check your plan details including deductibles, copays, and coinsurance',
          'Verify if specific services require prior authorization',
          'Understand your prescription drug formulary and tier levels',
          'Review your annual out-of-pocket maximum and current spending',
          'Check coverage for preventive care and wellness programs',
          'Contact member services for personalized coverage explanations'
        ],
        tips: [
          'Preventive care is covered at 100% with no copay',
          'Generic medications typically have lower copays',
          'Emergency services are covered even when out-of-network',
          'Keep your member ID card with you at all times',
          'Review your plan annually during open enrollment'
        ],
        icon: '❓'
      }
    },
    agent: {
      'enroll-clients': {
        title: 'How to enroll clients?',
        content: 'Our streamlined enrollment process makes it easy to sign up new clients efficiently.',
        steps: [
          'Access the agent portal at agents.dineshhealth.com',
          'Navigate to "New Enrollment" and select the appropriate plan type',
          'Complete the client application with accurate personal information',
          'Upload required documents (ID, income verification, current coverage)',
          'Review application for completeness and accuracy',
          'Submit application and receive confirmation number',
          'Track application status and communicate updates to client'
        ],
        tips: [
          'Use the mobile app for on-the-go enrollments',
          'Training videos are available in the resource center',
          'Bulk enrollment tools available for group plans',
          'Set up automated follow-ups for pending applications',
          'Earn bonus commissions for timely enrollment submissions'
        ],
        icon: '📝'
      },
      'commission-payments': {
        title: 'Commission payments?',
        content: 'Our transparent commission structure ensures timely and accurate payments.',
        steps: [
          'Commissions are calculated automatically based on enrolled clients',
          'Payments are processed monthly by the 15th of each month',
          'Direct deposit is set up during agent onboarding process',
          'Commission statements are available in the agent portal',
          'Year-to-date earnings tracking available in real-time',
          'Annual 1099 forms are generated automatically',
          'Contact agent support for any payment discrepancies'
        ],
        tips: [
          'Set up direct deposit for faster payment processing',
          'Review monthly statements for accuracy',
          'Track performance metrics to maximize earnings',
          'Participate in bonus programs for additional income',
          'Keep detailed records for tax purposes'
        ],
        icon: '💳'
      },
      'marketing-materials': {
        title: 'Marketing materials?',
        content: 'Access a comprehensive library of compliance-approved marketing resources.',
        steps: [
          'Log into the agent portal and navigate to "Resource Center"',
          'Browse categories: brochures, flyers, digital assets, presentations',
          'Filter materials by product type, target audience, or campaign',
          'Download high-resolution files in various formats (PDF, JPG, PNG)',
          'Customize materials with your contact information where permitted',
          'Access co-branded materials with DineshHealth and your agency',
          'Order printed materials through our fulfillment partner'
        ],
        tips: [
          'All materials are pre-approved for compliance',
          'New materials are added quarterly with product updates',
          'Request custom materials for large campaigns',
          'Use social media templates for digital marketing',
          'Track material effectiveness through campaign analytics'
        ],
        icon: '📊'
      }
    }
  };

  const currentContent = content[role];
  const selectedSection = section ? currentContent[section] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Find answers to common questions and step-by-step guides</p>
        </div>
        
        {selectedSection ? (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">{selectedSection.icon}</div>
                <h2 className="text-4xl font-bold text-purple-600 mb-6">{selectedSection.title}</h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">{selectedSection.content}</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide:</h3>
                  <div className="space-y-4">
                    {selectedSection.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Helpful Tips:</h3>
                  <div className="space-y-4">
                    {selectedSection.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <div className="text-yellow-600 text-xl">Ὂ1</div>
                        <p className="text-gray-700 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-6xl mx-auto">
            {Object.entries(currentContent).map(([key, item]) => (
              <div key={key} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-purple-600 mb-4">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{item.content}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Steps:</h4>
                        <div className="space-y-2">
                          {item.steps.slice(0, 3).map((step, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-gray-600">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
                        <div className="space-y-2">
                          {item.tips.slice(0, 3).map((tip, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="text-yellow-500">Ὂ1</div>
                              <p className="text-sm text-gray-600">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;