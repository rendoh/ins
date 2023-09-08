import type { ComponentPropsWithoutRef } from 'react';

import { css, cx } from '../../styled-system/css';

export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={cx(
        css({
          border: '1px solid currentColor',
          w: '100%',
        }),
        className,
      )}
      {...props}
    />
  );
}
