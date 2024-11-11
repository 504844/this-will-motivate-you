import React, { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { encodeSettings } from '../utils/urlEncoder';

interface ShareButtonProps {
  settings: {
    name: string;
    gender: string;
    birthDate: Date;
    lifeExpectancy: number;
  };
}

const ShareButton: React.FC<ShareButtonProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    const encoded = encodeSettings(settings);
    return `${window.location.origin}/?j=${encoded}`;
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors mx-auto"
    >
      {copied ? (
        <>
          <Check className="w-6 h-6" />
          <span className="text-sm">Copied to clipboard!</span>
        </>
      ) : (
        <>
          <Share2 className="w-6 h-6" />
          <span className="text-sm">Share your journey</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;