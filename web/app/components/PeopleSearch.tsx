'use client';

import { useState } from 'react';

export default function PeopleSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for people..."
          className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-full focus:border-primary focus:ring-primary outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60"
        />
      </div>
    </div>
  );
}
