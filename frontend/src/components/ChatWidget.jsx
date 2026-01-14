import React from 'react';

const ChatWidget = ({ onOpenChat }) => {
  const handleClick = () => {
    onOpenChat();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg flex items-center justify-center text-white z-40"
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </>
  );
};

export default ChatWidget;