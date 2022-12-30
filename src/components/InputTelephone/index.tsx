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

const InputTelephone: React.FC<InputProps> = ({ ...rest }) => {
  useEffect(() => {
    const SPMaskBehavior = (val: string): string => {
      return val.replace(/\D/g, '').length === 11
        ? '(00) 00000-0000'
        : '(00) 0000-00009';
    };

    $('.celphones').keyup(function (this) {
      const element: any = $(this);

      try {
        element.unmask();
      } catch (e) {
        console.log(e);
      }

      element.mask(SPMaskBehavior(element?.val() || ''));

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

  return <Input className="celphones" {...rest} />;
};

export default InputTelephone;
