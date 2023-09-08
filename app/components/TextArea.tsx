import type { ComponentPropsWithoutRef } from 'react';

import { css, cx } from '../../styled-system/css';

type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export function Textarea({ className, children, ...props }: TextareaProps) {
  return (
    <textarea
      className={cx(
        css({
          border: '1px solid currentColor',
          w: '100%',
        }),
        className,
      )}
      {...props}
    >
      {children}
    </textarea>
  );
}
