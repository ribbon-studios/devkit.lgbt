import { Database, ListTodo, LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export type HeaderProps = {
  children: ReactNode;
};

const items: Header.Item[] = [
  {
    href: '/todo',
    label: 'Todo List',
    icon: ListTodo,
  },
];

const additionalItems: Header.Item[] = [
  {
    href: '/data',
    label: 'View Data',
    icon: Database,
  },
];

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex min-h-screen max-h-screen">
      <div
        className={
          'rounded-lg flex flex-col bg-background border-r border-r-border shadow-sm shadow-indigo-950 p-4 gap-2 min-w-60'
        }
      >
        <Link className={'font-extrabold text-2xl hover:text-white/80 transition-colors'} to="/">
          Devkit
        </Link>
        {items.map((item, index) => {
          return (
            <Button key={index} className="flex gap-2 justify-start" size="sm" asChild variant="ghost">
              <Link to={item.href}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          );
        })}
        <div className="flex-1" />
        {additionalItems.map((item, index) => {
          return (
            <Button key={index} className="flex gap-2 justify-start" size="sm" asChild variant="ghost">
              <Link to={item.href}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col overflow-auto">{children}</div>
    </div>
  );
}

export namespace Header {
  export type Item = {
    label: string;
    href: string;
    icon: LucideIcon;
  };
}
