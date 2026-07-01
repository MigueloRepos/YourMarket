import React from 'react';

export default function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] rounded-xl bg-slate-200 mb-4"></div>
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-2"></div>
        {/* Brand */}
        <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-4"></div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 bg-slate-200 rounded-md w-16"></div>
        </div>
        
        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded-md w-20"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
