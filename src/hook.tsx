import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { DataPage } from './routes/DataPage';
import { ErrorPage } from './routes/ErrorPage';
import { HashingPage } from './routes/HashingPage';
import { Root } from './routes/Root';
import { TodoListPage } from './routes/TodoListPage';
import { TodoListsPage } from './routes/TodoListsPage';
import { IStorage, Storage } from './storage';

if (module.hot) {
  module.hot.accept();
}

export function hook(storage: IStorage) {
  console.log(`📡 Initializing storage...`);
  Storage.init(storage);

  console.log(`☄️ Setting up router...`);
  const router = createHashRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/todo',
          element: <TodoListsPage />,
          loader: TodoListsPage.loader,
        },
        {
          path: '/todo/:id',
          element: <TodoListPage />,
          loader: TodoListPage.loader,
        },
        {
          path: '/data',
          element: <DataPage />,
          loader: DataPage.loader,
        },
        {
          path: '/hash',
          element: <HashingPage />,
        },
      ],
    },
  ]);

  console.log(`🚀 Launching app!`);
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
