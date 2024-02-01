import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { REACT_ROUTES } from './routes';
import { IStorage, Storage } from './storage';

export function hook(storage: IStorage) {
  console.log(`📡 Initializing storage...`);
  Storage.init(storage);

  console.log(`☄️ Setting up router...`);
  const router = createHashRouter([
    {
      path: '/',
      lazy: () => import('./routes/Root'),
      children: REACT_ROUTES,
    },
  ]);

  console.log(`🚀 Launching app!`);
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
