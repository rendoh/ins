import type { ComponentPropsWithoutRef } from 'react';
import { useField } from 'remix-validated-form';

import { FieldError } from './FieldError';
import { Textarea } from './TextArea';

export function VfTextarea({
  ...props
}: ComponentPropsWithoutRef<'textarea'> & { name: string }) {
  const { error, getInputProps } = useField(props.name);
  return (
    <>
      <Textarea {...getInputProps(props)} />
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}
