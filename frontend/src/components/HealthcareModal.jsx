import { useState } from 'react';
import jsPDF from 'jspdf';

const HealthcareModal = ({ isOpen, onClose, articleId }) => {
  if (!isOpen) return null;

  const staticContent = {
    1: {
      title: "Why Health Insurance is Essential",
      content: [
        "• Protection from unexpected medical bills that can reach $100,000+",
        "• Access to preventive care services at no additional cost",
        "• Network of qualified healthcare providers and specialists",
        "• Coverage for prescription medications and treatments",
        "• Peace of mind for you and your family's health security"
      ],
      pdfUrl: "/pdfs/health-insurance-guide.pdf"
    },
    2: {
      title: "Benefits of Digital Healthcare Platforms",
      content: [
        "• 24/7 access to your health information and claims",
        "• Instant claim submissions and faster processing",
        "• Secure messaging with healthcare providers",
        "• Digital ID cards and document storage",
        "• Real-time benefits verification and cost estimates"
      ],
      pdfUrl: "/pdfs/digital-platform-benefits.pdf"
    },
    3: {
      title: "Smart Policy Comparison Saves Money",
      content: [
        "• Compare deductibles: High vs Low deductible plans",
        "• Network coverage: In-network saves 40-60% on costs",
        "• Prescription coverage: Generic vs brand name savings",
        "• Annual out-of-pocket maximums protect your budget",
        "• HSA eligibility can provide tax advantages"
      ],
      pdfUrl: "/pdfs/policy-comparison-guide.pdf"
    },
    4: {
      title: "Choosing the Right Health Plan",
      content: [
        "• Assess your current health needs and medications",
        "• Consider your preferred doctors and hospitals",
        "• Calculate total annual costs including premiums",
        "• Review coverage for specialist care and procedures",
        "• Understand plan networks and referral requirements"
      ],
      pdfUrl: "/pdfs/plan-selection-tips.pdf"
    }
  };

  const article = staticContent[articleId];
  if (!article) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // PDF content based on article
    const pdfContent = {
      1: {
        title: "Why Health Insurance is Essential - Complete Guide",
        sections: [
          "FINANCIAL PROTECTION:",
          "• Average hospital stay costs $15,000-$50,000",
          "• Emergency room visits average $2,200",
          "• Cancer treatment can exceed $200,000",
          "• Heart surgery ranges from $70,000-$200,000",
          "",
          "PREVENTIVE CARE BENEFITS:",
          "• Annual wellness exams at no cost",
          "• Vaccinations and screenings covered",
          "• Early detection saves lives and money",
          "• Chronic disease management programs",
          "",
          "NETWORK ACCESS:",
          "• 50,000+ healthcare providers nationwide",
          "• Specialist referrals and coordination",
          "• 24/7 nurse hotline support",
          "• Telemedicine consultations included"
        ]
      },
      2: {
        title: "Digital Healthcare Platform Benefits Guide",
        sections: [
          "CONVENIENCE FEATURES:",
          "• Mobile app with 4.8-star rating",
          "• Digital ID cards - no more lost cards",
          "• Instant claim status updates",
          "• Secure document upload and storage",
          "",
          "TIME-SAVING TOOLS:",
          "• Find in-network providers instantly",
          "• Schedule appointments online",
          "• Prescription refill reminders",
          "• Real-time benefit verification",
          "",
          "COST TRANSPARENCY:",
          "• Treatment cost estimates before visits",
          "• Compare facility prices in your area",
          "• Track deductible and out-of-pocket spending",
          "• HSA/FSA account integration"
        ]
      },
      3: {
        title: "Smart Policy Comparison - Money Saving Guide",
        sections: [
          "DEDUCTIBLE STRATEGIES:",
          "• High deductible: Lower premiums, HSA eligible",
          "• Low deductible: Higher premiums, immediate coverage",
          "• Average savings: $2,400/year with right choice",
          "• Consider your expected medical usage",
          "",
          "NETWORK SAVINGS:",
          "• In-network providers: 40-60% cost reduction",
          "• Out-of-network penalties: Up to 50% more",
          "• Verify your doctors are in-network",
          "• Emergency care covered at in-network rates",
          "",
          "PRESCRIPTION BENEFITS:",
          "• Generic drugs: 80-90% cheaper than brand",
          "• Mail-order pharmacy: 90-day supplies",
          "• Formulary tiers affect your costs",
          "• Prior authorization requirements vary"
        ]
      },
      4: {
        title: "Choosing the Right Health Plan - Decision Guide",
        sections: [
          "HEALTH ASSESSMENT:",
          "• List current medications and dosages",
          "• Identify chronic conditions needing care",
          "• Consider planned procedures or treatments",
          "• Factor in family medical history",
          "",
          "PROVIDER PREFERENCES:",
          "• Check if current doctors accept the plan",
          "• Verify hospital network participation",
          "• Consider specialist referral requirements",
          "• Review telehealth options available",
          "",
          "COST CALCULATIONS:",
          "• Monthly premium x 12 months",
          "• Add estimated deductible costs",
          "• Include regular prescription costs",
          "• Factor in copays for routine visits",
          "• Total annual cost comparison is key"
        ]
      }
    };

    const content = pdfContent[articleId];
    if (!content) return;

    // Add title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(content.title, 20, 20);
    
    // Add DineshHealth branding
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('DineshHealth Insurance - Your Trusted Healthcare Partner', 20, 30);
    
    // Add content
    doc.setFontSize(11);
    let yPosition = 45;
    
    content.sections.forEach((line) => {
      if (line === '') {
        yPosition += 5;
      } else if (line.endsWith(':')) {
        doc.setFont(undefined, 'bold');
        doc.text(line, 20, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition += 8;
      } else {
        doc.text(line, 20, yPosition);
        yPosition += 6;
      }
      
      // Add new page if needed
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Add footer
    doc.setFontSize(8);
    doc.text('© 2024 DineshHealth Insurance. All rights reserved.', 20, 285);
    
    // Save PDF
    doc.save(`${article.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Key Information:</h3>
            <ul className="space-y-2">
              {article.content.map((item, index) => (
                <li key={index} className="text-gray-700 text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Download PDF Guide
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareModal;