import { useSearchParams } from 'react-router-dom';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const role = localStorage.getItem('role') || 'member';
  const section = searchParams.get('section');

  const content = {
    member: {
      'member-services': {
        title: 'Member Services',
        phone: '1-800-MEMBER (1-800-636-2371)',
        hours: 'Available 24/7',
        description: 'Our dedicated member services team is here to assist you with all your healthcare needs.',
        services: [
          'Benefits verification and explanation of coverage',
          'Claims status inquiries and dispute resolution',
          'Provider network searches and referrals',
          'ID card replacements and account updates',
          'Prescription coverage and formulary questions',
          'Wellness program enrollment and rewards tracking',
          'Billing inquiries and payment assistance',
          'General account management and support'
        ],
        icon: '👥'
      },
      'claims-department': {
        title: 'Claims Department',
        phone: '1-800-CLAIMS (1-800-252-4671)',
        hours: 'Monday-Friday 8AM-6PM EST',
        description: 'Specialized support for all your claims-related needs and inquiries.',
        services: [
          'Claims submission assistance and guidance',
          'Claims status tracking and updates',
          'Explanation of Benefits (EOB) clarification',
          'Appeals and dispute resolution process',
          'Prior authorization requests and approvals',
          'Coordination of benefits for multiple insurances',
          'Provider billing inquiries and corrections',
          'Reimbursement processing and direct deposits'
        ],
        icon: '📋'
      },
      'emergency-line': {
        title: 'Emergency Line',
        phone: '1-800-URGENT (1-800-874-3681)',
        hours: '24/7 emergency assistance',
        description: 'Immediate support for urgent healthcare situations and emergencies.',
        services: [
          'Emergency room pre-authorization',
          'Urgent care facility location assistance',
          'After-hours medical advice and triage',
          'Emergency prescription approvals',
          'Medical emergency travel assistance',
          'Crisis intervention and mental health support',
          'Ambulance service coordination',
          'International emergency medical support'
        ],
        icon: '🚨'
      }
    },
    agent: {
      'agent-support': {
        title: 'Agent Support',
        phone: '1-800-AGENTS (1-800-243-6871)',
        hours: 'Monday-Friday 7AM-7PM EST',
        description: 'Comprehensive support for insurance agents and brokers.',
        services: [
          'Client enrollment assistance and processing',
          'Policy changes and updates management',
          'Commission inquiries and payment tracking',
          'Product training and certification support',
          'Marketing materials and compliance guidance',
          'Lead generation program assistance',
          'Territory management and expansion support',
          'Performance analytics and reporting tools'
        ],
        icon: '🤝'
      },
      'technical-help': {
        title: 'Technical Help',
        phone: '1-800-TECH-HELP (1-800-832-4435)',
        hours: '24/7 system support',
        description: 'Technical assistance for all digital platforms and tools.',
        services: [
          'Agent portal login and access issues',
          'Password resets and security updates',
          'System navigation and feature tutorials',
          'Mobile app troubleshooting and updates',
          'Integration support for third-party tools',
          'Data synchronization and backup assistance',
          'Report generation and customization help',
          'Software updates and maintenance notifications'
        ],
        icon: '🔧'
      },
      'sales-team': {
        title: 'Sales Team',
        phone: '1-800-SALES (1-800-725-3771)',
        hours: 'Monday-Friday 8AM-8PM EST',
        description: 'Sales support and business development assistance.',
        services: [
          'New product launches and feature updates',
          'Competitive analysis and market positioning',
          'Sales strategy development and optimization',
          'Lead qualification and conversion support',
          'Presentation materials and sales tools',
          'Client retention strategies and programs',
          'Territory expansion and market analysis',
          'Performance incentives and bonus programs'
        ],
        icon: '📈'
      }
    }
  };

  const currentContent = content[role];
  const selectedSection = section ? currentContent[section] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Contact DineshHealth</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">We're here to help you 24/7 with dedicated support teams for all your needs</p>
        </div>
        
        {selectedSection ? (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">{selectedSection.icon}</div>
                <h2 className="text-4xl font-bold text-green-600 mb-4">{selectedSection.title}</h2>
                <div className="bg-green-50 rounded-2xl p-8 mb-8">
                  <div className="text-3xl font-bold text-green-800 mb-2">{selectedSection.phone}</div>
                  <div className="text-xl text-green-600 font-medium mb-4">{selectedSection.hours}</div>
                  <p className="text-lg text-gray-700 leading-relaxed">{selectedSection.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 md:col-span-2">Our Services Include:</h3>
                {selectedSection.services.map((service, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-6 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{service}</p>
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
                  <h3 className="text-2xl font-bold text-green-600 mb-4">{item.title}</h3>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="font-bold text-green-800 text-lg">{item.phone}</div>
                    <div className="text-sm text-green-600">{item.hours}</div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                </div>
                <div className="space-y-2">
                  {item.services.slice(0, 4).map((service, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <p className="text-sm text-gray-600">{service}</p>
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

export default Contact;