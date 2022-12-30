/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import {
  FiMail,
  FiUser,
  FiCamera,
  FiGlobe,
  FiMapPin,
  FiPhoneCall,
} from 'react-icons/fi';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import userImg from '../../assets/user.png';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Select from '../Select';
import Input from '../Input';
import Button from '../Button';
import InputCPF from '../InputCPF';

import { FormGroup, FormGroupBlock, Avatar, AvatarInput } from './styles';
import { Option, City, Supplier } from '../../types';
import InputTelephone from '../InputTelephone';
import InputCEP from '../InputCEP';

interface ICityOption extends City, Option {}

interface ProfileEditSupplier {
  name_social_reason: string;
  name_fantasy: string;
  cnpj: string;
  tel: string;
  tel2: string;
  domain: string;
  neighborhood: string;
  street: string;
  cep: string;
  number: string;
  complement: string;
  city_id: string;
  representative_name: string;
  mail: string;
  mail2: string;
  logo: string;
  note: string;
}

interface FormSupplierProps {
  initialData?: any;
  method: 'edit' | 'add';
  url: string;
}

const FormSupplier: React.FC<FormSupplierProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const history = useHistory();
  const [cities, setCities] = useState<ICityOption[]>([]);
  const [supplier, setSupplier] = useState<Supplier | null>(null);

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

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ProfileEditSupplier) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name_social_reason: Yup.string().required('Razão Social obrigatório'),
          name_fantasy: Yup.string().required('Nome Fantasia obrigatório'),
          cnpj: Yup.string()
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
            .required('CPF/CNPJ obrigatório'),
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
          domain: Yup.string(),
          neighborhood: Yup.string(),
          street: Yup.string(),
          cep: Yup.string().test(
            'len',
            'Tamanho inválido',
            val => val?.length === 9 || val?.length === 0,
          ),
          number: Yup.string(),
          complement: Yup.string(),
          representative_name: Yup.string(),
          mail: Yup.string().email('Digite um e-mail válido'),
          mail2: Yup.string().email('Digite um e-mail válido'),
          note: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name_social_reason,
          name_fantasy,
          cnpj,
          tel,
          tel2,
          domain,
          neighborhood,
          street,
          cep,
          number,
          complement,
          city_id,
          representative_name,
          mail,
          mail2,
          note,
        } = data;

        const formData = {
          name_social_reason,
          name_fantasy,
          cnpj,
          tel,
          tel2,
          domain,
          city_id,
          neighborhood,
          street,
          cep,
          number,
          complement,
          representative_name,
          mail,
          mail2,
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
            title: 'Fornecedor Atualizado!',
            description: 'Novo fornecedor atualizado com sucesso!',
          });
        }

        history.push('/suppliers');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na Atualização!',
          description: err.response?.data?.error,
        });
      }
    },
    [addToast, history, method, url],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): any => {
      if (method === 'add') {
        return window.alert(
          'Cadastre o fornecedor para poder adicionar uma logo',
        );
      }

      const data = new FormData();

      const { files } = e.target;
      if (files) {
        data.append('logo', files[0]);

        api.patch(`suppliers/${initialData?.id}/logo`, data).then(response => {
          setSupplier(response.data);
          addToast({
            type: 'success',
            title: 'Logo atualizado!',
          });
        });
      }
    },
    [addToast, method, initialData?.id],
  );

  const handleCEPChange = useCallback(
    (city: ICityOption, street: string, neighborhood: string) => {
      formRef.current?.setData({
        street,
        neighborhood,
        city_id: city,
        number: '',
        complement: '',
      });
    },
    [],
  );

  return (
    <Form initialData={initialData} ref={formRef} onSubmit={handleSubmit}>
      <FormGroup>
        <FormGroupBlock>
          <Avatar>
            <AvatarInput>
              <img
                src={
                  initialData?.logo_url
                    ? initialData.logo_url
                    : supplier?.logo_url
                    ? supplier?.logo_url
                    : userImg
                }
                alt={supplier?.name_fantasy}
              />
              <label htmlFor="logo">
                <FiCamera />
                <input id="logo" type="file" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>
          </Avatar>
        </FormGroupBlock>

        <FormGroupBlock>
          <h2>Nome:</h2>
          <Input name="name_social_reason" placeholder="Razão Social" />
          <Input name="name_fantasy" placeholder="Nome Fantasia" />
          <Input name="domain" icon={FiGlobe} placeholder="Site" />
          <InputCPF name="cnpj" icon={FiGlobe} placeholder="CNPJ" />
        </FormGroupBlock>
      </FormGroup>

      <FormGroup>
        <FormGroupBlock>
          <h2>Endereço:</h2>
          <InputCEP
            name="cep"
            icon={FiMapPin}
            placeholder="CEP"
            handleCEPChange={handleCEPChange}
            cities={cities}
          />
          <Input name="street" icon={FiMapPin} placeholder="Rua" />
          <Input name="number" icon={FiMapPin} placeholder="Número" />
          <Input name="complement" icon={FiMapPin} placeholder="Complemento" />
          <Input name="neighborhood" icon={FiMapPin} placeholder="Bairro" />
          <Select name="city_id" placeholder="Cidade" options={cities} />
        </FormGroupBlock>

        <FormGroupBlock>
          <h2>Representante:</h2>
          <Input
            name="representative_name"
            icon={FiUser}
            placeholder="Nome Representante"
          />
          <Input name="mail" icon={FiMail} placeholder="E-mail Representante" />
          <Input name="mail2" icon={FiMail} placeholder="E-mail Secundário" />
          <InputTelephone
            name="tel"
            icon={FiPhoneCall}
            placeholder="Telefone Principal"
          />
          <InputTelephone
            name="tel2"
            icon={FiPhoneCall}
            placeholder="Telefone Secundário"
          />
          <Input name="note" icon={FiPhoneCall} placeholder="Anotação" />
        </FormGroupBlock>
      </FormGroup>

      <div>
        <Button type="submit">
          {`${method === 'edit' ? 'Atualizar' : 'Cadastrar'}  Fornecedor`}
        </Button>
      </div>
    </Form>
  );
};

export default FormSupplier;
