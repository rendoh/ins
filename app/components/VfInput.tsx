import type { ComponentPropsWithoutRef } from 'react';
import { useField } from 'remix-validated-form';

import { FieldError } from './FieldError';
import { Input } from './Input';

export function VfInput({
  ...props
}: ComponentPropsWithoutRef<'input'> & { name: string }) {
  const { error, getInputProps } = useField(props.name);
  return (
    <>
      <Input {...getInputProps(props)} />
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}
