import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { css, cx } from '../../styled-system/css';

export type ButtonProps<T extends ElementType> = {
  tag?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'tag'>;

export function Button<T extends ElementType = 'button'>({
  tag,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = tag || 'button';
  return (
    <Component
      className={cx(
        css({
          border: '1px solid currentColor',
          p: '2px 12px',
        }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
