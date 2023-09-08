import type { PropsWithChildren } from 'react';

import type { RecipeVariantProps } from '../../styled-system/css';
import { cva } from '../../styled-system/css';

type AlertProps = PropsWithChildren<RecipeVariantProps<typeof alert>>;

const alert = cva({
  base: {
    fontWeight: 'bold',
    width: 'fit-content',
    color: 'white',
  },
  variants: {
    type: {
      success: {
        bgColor: 'green',
      },
      error: {
        bgColor: 'red',
      },
    },
  },
  defaultVariants: {
    type: 'success',
  },
});

export function Alert({ type, children }: AlertProps) {
  return (
    <div
      className={alert({
        type,
      })}
    >
      {children}
    </div>
  );
}
