import { useIsSubmitting } from 'remix-validated-form';

import type { ButtonProps } from './Button';
import { Button } from './Button';

export function VfButton(props: ButtonProps<'button'>) {
  const isSubmitting = useIsSubmitting();
  return <Button {...props} disabled={isSubmitting} />;
}
