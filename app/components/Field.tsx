import type { PropsWithChildren } from 'react';

import { css } from '../../styled-system/css';

type FieldProps = PropsWithChildren<{
  label: string;
  htmlFor?: string;
}>;

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div
      className={css({
        '& + &': {
          mt: '10px',
        },
      })}
    >
      <label
        className={css({
          display: 'block',
          w: 'fit-content',
          mb: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
        })}
        htmlFor={htmlFor}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
