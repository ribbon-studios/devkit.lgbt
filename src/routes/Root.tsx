import { Header } from '@/components/Header';
import { Outlet } from 'react-router-dom';
import './Root.css';

export function Root() {
  return (
    <Header>
      <Outlet />
    </Header>
  );
}
