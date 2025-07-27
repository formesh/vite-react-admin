import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import router from './router';
// 加载中的组件
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">加载中...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider 
        router={router}
      />
    </Suspense>
  );
}

export default App;