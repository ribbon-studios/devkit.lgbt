import { Header } from '@/components/Header';
import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <Header>
      <Outlet />
    </Header>
  );
}
