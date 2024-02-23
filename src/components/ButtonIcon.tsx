import { cn } from '@/lib/utils';
import { ExternalLink, LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonProps } from './ui/button';

export type ButtonIconProps = {
  icon: LucideIcon;
  children: ReactNode;
  to?: string;
} & ButtonProps;

export const ButtonIcon = React.forwardRef<HTMLButtonElement, ButtonIconProps>(
  ({ children, className, icon: Icon, to, ...props }, ref) => {
    const isExternal = to && to.startsWith('https');

    const content = (
      <>
        <Icon />
        <div className="hidden sm:block flex-1">{children}</div>
        {isExternal && <ExternalLink className="hidden sm:block" />}
      </>
    );

    return (
      <Button
        className={cn('flex gap-2 p-0 size-10 sm:w-auto sm:px-3 items-center justify-center', className)}
        size="sm"
        asChild={Boolean(to)}
        ref={ref}
        {...props}
      >
        {to ? (
          <Link to={to} target={isExternal ? '_blank' : undefined}>
            {content}
          </Link>
        ) : (
          content
        )}
      </Button>
    );
  }
);

export namespace Header {
  export type Item = {
    label: string;
    href: string;
    icon: LucideIcon;
  };
}
