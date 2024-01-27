import { ROUTES, SUB_ROUTES } from '@/routes';
import { Bug, Code, LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ButtonIcon } from './ButtonIcon';

export type HeaderProps = {
  children: ReactNode;
};

const additionalItems = [
  ...SUB_ROUTES,
  ...([
    {
      path: 'https://github.com/rain-cafe/devkit.lgbt/issues',
      label: 'Report an Issue',
      icon: Bug,
    },
    {
      path: 'https://github.com/rain-cafe/devkit.lgbt',
      label: 'Source Code',
      icon: Code,
    },
  ] as Header.Item[]),
];

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex min-h-dvh max-h-dvh">
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
        {ROUTES.map((item, index) => (
          <ButtonIcon key={index} icon={item.icon} to={item.path} variant="ghost">
            {item.label}
          </ButtonIcon>
        ))}
        <div className="flex-1" />
        {additionalItems.map((item, index) => (
          <ButtonIcon key={index} icon={item.icon} to={item.path} variant="ghost">
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
    path: string;
    icon: LucideIcon;
  };
}
