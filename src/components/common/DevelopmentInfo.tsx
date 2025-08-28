"use client";

import { useEffect, useState } from 'react';

const DevelopmentInfo: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <details className="text-xs text-gray-400">
        <summary className="cursor-pointer mb-2">Development Info</summary>
        <div className="bg-gray-50 rounded p-2 font-mono">
          <div>Environment: development</div>
          <div>Next.js Version: 15.5.0</div>
          <div>React Version: 19.1.0</div>
        </div>
      </details>
    </div>
  );
};

export default DevelopmentInfo;