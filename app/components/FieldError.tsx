import type { PropsWithChildren } from 'react';

import { css } from '../../styled-system/css';

export function FieldError({ children }: PropsWithChildren) {
  return (
    <p
      className={css({
        color: 'red',
        fontSize: '12px',
      })}
    >
      {children}
    </p>
  );
}
