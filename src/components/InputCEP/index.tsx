import React, { InputHTMLAttributes, useCallback, useEffect } from 'react';
import { IconBaseProps } from 'react-icons';
import getDataByCep from 'cep-promise';
import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';

import Input from '../Input';

import { Option, City } from '../../types';

interface ICityOption extends City, Option {}

interface CEPPromiseResponse {
  cep: string;
  city: string;
  neighborhood: string;
  service: string;
  state: string;
  street: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
  cities: ICityOption[];
  handleCEPChange: any;
}

const InputCEP: React.FC<InputProps> = ({
  handleCEPChange,
  cities,
  ...rest
}) => {
  useEffect(() => {
    $('.cep').keyup(function (this) {
      const element = $('.cep');

      try {
        element.unmask();
      } catch (e) {
        console.log(e);
      }

      element.mask('00000-000');

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

  const getAdressByCEP = useCallback(
    (cepData: string) => {
      if (cepData && cepData !== '') {
        getDataByCep(cepData)
          .then((res: CEPPromiseResponse) => {
            const { city: city_name, street, neighborhood } = res;

            const cityFind: any = cities.find(c => c.name === city_name);

            handleCEPChange(cityFind, street, neighborhood);
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    },
    [cities, handleCEPChange],
  );

  return (
    <Input
      className="cep"
      onBlurCapture={e => getAdressByCEP(e.target.value)}
      {...rest}
    />
  );
};

export default InputCEP;
