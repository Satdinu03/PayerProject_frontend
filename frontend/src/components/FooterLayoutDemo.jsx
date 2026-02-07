import { useState } from 'react';
import Footer from './Footer';

const FooterLayoutDemo = () => {
  const [selectedLayout, setSelectedLayout] = useState('grid');

  const layouts = [
    { id: 'grid', name: 'Article Grid', description: 'Card-based layout with icons and full descriptions' },
    { id: 'blog', name: 'Blog Preview', description: 'Featured articles in a blog-style format' },
    { id: 'links', name: 'Resource Links', description: 'Organized link sections with categories' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Layout Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Footer Layout Options</h1>
          <div className="flex flex-wrap gap-4">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => setSelectedLayout(layout.id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedLayout === layout.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-medium">{layout.name}</div>
                <div className="text-xs opacity-75">{layout.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Layout: {layouts.find(l => l.id === selectedLayout)?.name}
          </h2>
          <p className="text-gray-600 mb-6">
            {layouts.find(l => l.id === selectedLayout)?.description}
          </p>
          
          {/* Sample page content to show footer in context */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-8 mb-4">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Sample Page Content</h3>
            <p className="text-blue-700 mb-4">
              This demonstrates how the footer appears at the bottom of your pages.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Feature 1</h4>
                <p className="text-gray-600 text-sm">Sample content to show page layout</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Feature 2</h4>
                <p className="text-gray-600 text-sm">Sample content to show page layout</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Feature 3</h4>
                <p className="text-gray-600 text-sm">Sample content to show page layout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Demo */}
      <Footer layout={selectedLayout} />
    </div>
  );
};

export default FooterLayoutDemo;