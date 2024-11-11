import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

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
    const params = new URLSearchParams({
      name: settings.name,
      gender: settings.gender,
      birthDate: settings.birthDate.toISOString(),
      lifeExpectancy: settings.lifeExpectancy.toString()
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Life Journey',
          text: `Check out ${settings.name}'s life journey in weeks!`,
          url: shareUrl
        });
      } catch (err) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
      title="Share your journey"
    >
      {copied ? (
        <>
          <Check className="w-5 h-5" />
          <span className="text-sm">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Share</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;