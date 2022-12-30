import React, { InputHTMLAttributes, useEffect } from 'react';
import { IconBaseProps } from 'react-icons';
import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';

import Input from '../Input';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputCPF: React.FC<InputProps> = ({ ...rest }) => {
  useEffect(() => {
    const CPFMaskBehavior = (val: string): string => {
      return val.replace(/\D/g, '').length < 12
        ? '000.000.000-009999'
        : '00.000.000/0000-00';
    };

    $('#cpfcnpj').keyup(function (this) {
      const element = $('#cpfcnpj');

      try {
        element.unmask();
      } catch (e) {
        console.log(e);
      }

      element.mask(CPFMaskBehavior(String(element?.val()) || ''));

      const that: any = this;
      setTimeout(() => {
        that.selectionStart = 10000;
        that.selectionEnd = 10000;
      }, 0);

      const currentValue = element.val() || '';
      element.val('');
      element.val(currentValue);
    });
  }, []);

  return <Input id="cpfcnpj" {...rest} />;
};

export default InputCPF;
