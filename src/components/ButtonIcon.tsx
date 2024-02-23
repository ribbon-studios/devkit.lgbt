import { cn } from '@/lib/utils';
import { ExternalLink, LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonProps } from './ui/button';

export type ButtonIconProps = {
  icon: LucideIcon;
  children: ReactNode;
  href?: string;
} & ButtonProps;

export function ButtonIcon({ children, className, icon: Icon, href, ...props }: ButtonIconProps) {
  const isExternal = href && href.startsWith('https');

  const content = (
    <>
      <Icon />
      <div className="hidden sm:block flex-1">{children}</div>
      {isExternal && <ExternalLink className="hidden sm:block" />}
    </>
  );

  return (
    <Button
      className={cn('flex gap-2 p-0 size-10 sm:w-fit sm:px-3 items-center justify-center', className)}
      size="sm"
      asChild={Boolean(href)}
      {...props}
    >
      {href ? (
        <Link to={href} target={isExternal ? '_blank' : undefined}>
          {content}
        </Link>
      ) : (
        content
      )}
    </Button>
  );
}

export namespace Header {
  export type Item = {
    label: string;
    href: string;
    icon: LucideIcon;
  };
}
