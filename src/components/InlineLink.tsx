import { ExternalLink } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type InlineLinkProps = {
  children: ReactNode;
  to: string;
};

export function InlineLink({ children, to }: InlineLinkProps) {
  const isExternal = /^https?:\/\//.test(to);

  return (
    <Link
      className="inline-flex gap-1 mx-1 items-center text-blue-400 hover:underline"
      to="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#algorithm"
      target={isExternal ? '_blank' : undefined}
    >
      {children}
      {isExternal && <ExternalLink className="size-4" />}
    </Link>
  );
}
