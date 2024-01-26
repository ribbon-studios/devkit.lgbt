import { Bug, Code, Database, ListTodo, LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ButtonIcon } from './ButtonIcon';

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
  {
    href: 'https://github.com/rain-cafe/devkit.lgbt/issues',
    label: 'Report an Issue',
    icon: Bug,
  },
  {
    href: 'https://github.com/rain-cafe/devkit.lgbt',
    label: 'Source Code',
    icon: Code,
  },
];

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex min-h-screen max-h-screen">
      <div
        className={
          'flex flex-col bg-background border-r border-r-border shadow-sm shadow-indigo-950 p-2 sm:p-4 gap-2 min-w-8 sm:min-w-60'
        }
      >
        <Link
          className="flex items-center justify-center sm:justify-start font-extrabold text-2xl hover:text-white/80 transition-colors"
          to="/"
        >
          D<span className="hidden sm:inline">evkit</span>
        </Link>
        {items.map((item, index) => (
          <ButtonIcon key={index} icon={item.icon} href={item.href} variant="ghost">
            {item.label}
          </ButtonIcon>
        ))}
        <div className="flex-1" />
        {additionalItems.map((item, index) => (
          <ButtonIcon key={index} icon={item.icon} href={item.href} variant="ghost">
            {item.label}
          </ButtonIcon>
        ))}
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
