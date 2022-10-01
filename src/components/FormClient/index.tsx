/* eslint-disable no-useless-escape */
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FiMail, FiUser, FiMapPin, FiPhoneCall, FiBook } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import getDataByCep2 from 'cep-promise';
import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Select from '../Select';
import Input from '../Input';
import Button from '../Button';

import { FormGroup, FormGroupBlock } from './styles';

import { Option, City } from '../../types';

interface ICityOption extends City, Option {}

interface AddClientFormData {
  name: string;
  document: string;
  tel: string;
  tel2: string;
  city_id: string;
  neighborhood: string;
  street: string;
  cep: string;
  number: string;
  complement: string;
  mail: string;
  note: string;
}

interface CEPPromiseResponse {
  cep: string;
  city: string;
  neighborhood: string;
  service: string;
  state: string;
  street: string;
}

interface FormClientProps {
  initialData?: any;
  method: 'edit' | 'add';
  url: string;
}

const FormClient: React.FC<FormClientProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const history = useHistory();
  const [cities, setCities] = useState<ICityOption[]>([]);

  const formRef = useRef<FormHandles>(null);

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

  useEffect(() => {
    api.get(`/city`).then(responseCity => {
      const CitiesData = responseCity.data.map((cityCurrent: City) => ({
        ...cityCurrent,
        value: cityCurrent.id,
        label: cityCurrent.name,
      }));

      setCities(CitiesData);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: AddClientFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          document: Yup.string()
            .matches(
              /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/,
              'Escreva o CNPJ/CPF com os pontos e virgulas',
            )
            .test(
              'len',
              'Tamanho inválido',
              val => val?.length === 14 || val?.length === 18,
            )
            .min(14, 'Mínimo 14 caracteres')
            .max(18, 'Máximo 18 caracteres')
            .required('Documento obrigatório'),
          tel: Yup.string().test(
            'len',
            'Tamanho inválido',
            val =>
              val?.length === 14 || val?.length === 15 || val?.length === 0,
          ),
          tel2: Yup.string().test(
            'len',
            'Tamanho inválido',
            val =>
              val?.length === 14 || val?.length === 15 || val?.length === 0,
          ),
          neighborhood: Yup.string(),
          street: Yup.string(),
          cep: Yup.string().test(
            'len',
            'Tamanho inválido',
            val => val?.length === 9 || val?.length === 0,
          ),
          number: Yup.string(),
          complement: Yup.string(),
          mail: Yup.string().email(),
          note: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          document,
          tel,
          tel2,
          neighborhood,
          street,
          city_id,
          cep,
          number,
          complement,
          mail,
          note,
        } = data;

        const formData = {
          name,
          document,
          tel,
          tel2,
          neighborhood,
          street,
          city_id,
          cep,
          number,
          complement,
          mail,
          note,
        };

        const methods = {
          edit: async () => api.put(url, formData),
          add: async () => api.post(url, formData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: 'success',
            title: 'Cliente Cadastrado!',
            description: 'Novo cliente cadastrado com sucesso!',
          });
        }

        history.push('/clients');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no Cadastro!',
          description: err.response?.data?.error,
        });
      }
    },
    [addToast, url, method, history],
  );

  const getAdressByCEP = useCallback(
    (cepData: string) => {
      if (cepData && cepData !== '') {
        getDataByCep2(cepData)
          .then((res: CEPPromiseResponse) => {
            const { city: city_name, street, neighborhood } = res;

            const cityFind: any = cities.find(c => c.name === city_name);

            formRef.current?.setData({
              street,
              neighborhood,
              city_id: cityFind,
              number: '',
              complement: '',
            });
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    },
    [cities],
  );

  return (
    <Form initialData={initialData} ref={formRef} onSubmit={handleSubmit}>
      <FormGroup>
        <FormGroupBlock>
          <h2>Dados pessoais:</h2>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input
            id="cpfcnpj"
            name="document"
            icon={FiUser}
            placeholder="Documento"
          />
          <Input
            className="celphones"
            name="tel"
            icon={FiPhoneCall}
            placeholder="Telefone Principal"
          />
          <Input
            className="celphones"
            name="tel2"
            icon={FiPhoneCall}
            placeholder="Telefone Secundário"
          />
          <Input name="mail" icon={FiMail} placeholder="E-mail" />
          <Input name="note" icon={FiBook} placeholder="Anotação" />
        </FormGroupBlock>
        <FormGroupBlock>
          <h2>Endereço:</h2>
          <Input
            name="cep"
            className="cep"
            onBlurCapture={e => getAdressByCEP(e.target.value)}
            icon={FiMapPin}
            placeholder="CEP"
          />
          <Input name="street" icon={FiMapPin} placeholder="Rua" />
          <Input name="number" icon={FiMapPin} placeholder="Número" />
          <Input name="complement" icon={FiMapPin} placeholder="Complemento" />
          <Input name="neighborhood" icon={FiMapPin} placeholder="Bairro" />
          <Select name="city_id" placeholder="Cidade" options={cities} />
        </FormGroupBlock>
      </FormGroup>

      <div>
        <Button type="submit">Atualizar Cliente</Button>
      </div>
    </Form>
  );
};

export default FormClient;
