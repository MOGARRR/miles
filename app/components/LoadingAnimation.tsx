"use client";

const LoadingAnimation = () => {
  return (
    <div className="pt-24 px-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-500 border-t-transparent" />
    </div>
  );
};

export default LoadingAnimation;
