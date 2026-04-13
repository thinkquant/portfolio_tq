import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

import {
  getProtectedEmailAddress,
  getProtectedMailtoHref,
} from '@/lib/protectedEmail';

type ProtectedEmailLinkProps = {
  className?: string;
  revealLabel?: string;
};

type ProtectedEmailButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function ProtectedEmailLink({
  className,
  revealLabel = 'Email',
}: ProtectedEmailLinkProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (isRevealed) {
    return (
      <a className={className} href={getProtectedMailtoHref()}>
        {getProtectedEmailAddress()}
      </a>
    );
  }

  return (
    <button
      className={className}
      onClick={() => setIsRevealed(true)}
      type="button"
    >
      {revealLabel}
    </button>
  );
}

export function ProtectedEmailButton({
  children,
  onClick,
  type = 'button',
  ...props
}: ProtectedEmailButtonProps) {
  return (
    <button
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          window.location.href = getProtectedMailtoHref();
        }
      }}
      type={type}
    >
      {children}
    </button>
  );
}
