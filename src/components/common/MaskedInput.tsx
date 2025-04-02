import React, { useEffect, useRef } from 'react';
import IMask from 'imask';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: IMask.AnyMaskedOptions;
  value: string;
  onChange: (value: string) => void;
}

export function MaskedInput({ mask, value, onChange, ...props }: MaskedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<IMask.InputMask<any>>();

  useEffect(() => {
    if (inputRef.current && !maskRef.current) {
      maskRef.current = IMask(inputRef.current, {
        ...mask,
        lazy: false
      });

      maskRef.current.on('accept', () => {
        onChange(maskRef.current!.value);
      });
    }

    return () => {
      if (maskRef.current) {
        maskRef.current.destroy();
        maskRef.current = undefined;
      }
    };
  }, [mask, onChange]);

  useEffect(() => {
    if (maskRef.current && value !== undefined) {
      maskRef.current.value = value || '';
    }
  }, [value]);

  return <input ref={inputRef} type="text" {...props} />;
}