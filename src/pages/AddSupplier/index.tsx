/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  FiMail,
  FiUser,
  FiCamera,
  FiGlobe,
  FiMapPin,
  FiPhoneCall,
} from 'react-icons/fi';
import Select from 'react-select';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import getDataByCep from 'cep-promise';

import userImg from '../../assets/user.png';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Content,
  Avatar,
  AvatarInput,
  FormGroup,
  FormGroupBlock,
} from './styles';
import MenuHeader from '../../components/MenuHeader';
import { City } from '../../types/City';

interface AddSupplierFormData {
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
  representative_name: string;
  mail: string;
  mail2: string;
  logo: string;
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

const AddSupplier: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City | null>(null);

  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    api.get(`/city`).then(response => {
      const CitiesData = response.data.map((cityCurrent: City) => ({
        ...cityCurrent,
        value: cityCurrent.id,
        label: cityCurrent.name,
      }));
      setCities(CitiesData);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: AddSupplierFormData) => {
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
            .required('CNPJ obrigatório'),
          tel: Yup.string(),
          tel2: Yup.string(),
          domain: Yup.string(),
          neighborhood: Yup.string(),
          street: Yup.string(),
          cep: Yup.string()
            .min(8, 'Mínimo 8 caracteres')
            .max(8, 'Máximo 8 caracteres')
            .required('CEP obrigatório'),
          number: Yup.string(),
          complement: Yup.string(),
          representative_name: Yup.string(),
          mail: Yup.string().email(),
          mail2: Yup.string().email(),
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
          city_id: city?.id,
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

        const response = await api.post('/suppliers', formData);

        if (response.data) {
          addToast({
            type: 'success',
            title: 'Fornecedor Cadastrado!',
            description: 'Novo fornecedor cadastrado com sucesso!',
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
          title: 'Erro no Cadastro!',
          description: err.response?.data?.error,
        });
      }
    },
    [addToast, history, city],
  );

  const handleLogoChange = useCallback(() => {
    window.alert('Cadastre o fornecedor para poder adicionar uma logo');
  }, []);

  const getAdressByCEP = useCallback(
    (cepData: string) => {
      if (cepData && cepData !== '') {
        getDataByCep(cepData)
          .then((res: CEPPromiseResponse) => {
            const { city: city_name, street, neighborhood } = res;

            const cityFind = cities.find(c => c.name === city_name);
            setCity(cityFind || null);

            formRef.current?.setData({
              street,
              neighborhood,
            });
          })
          .catch(() => {
            setCity(null);
          });
      }
    },
    [cities],
  );

  return (
    <Container>
      <MenuHeader />

      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Novo Fornecedor</h1>
          <FormGroup>
            <FormGroupBlock>
              <Avatar>
                <AvatarInput>
                  <img src={userImg} alt="Logo Fornecedor" />
                  <label htmlFor="logo">
                    <FiCamera />
                    <input
                      id="logo"
                      type="checkbox"
                      onClick={handleLogoChange}
                    />
                  </label>
                </AvatarInput>
              </Avatar>
            </FormGroupBlock>

            <FormGroupBlock>
              <h2>Nome:</h2>
              <Input name="name_social_reason" placeholder="Razão Social" />
              <Input name="name_fantasy" placeholder="Nome Fantasia" />
              <Input name="domain" icon={FiGlobe} placeholder="Site" />
              <Input name="cnpj" icon={FiGlobe} placeholder="CNPJ" />
            </FormGroupBlock>
          </FormGroup>

          <FormGroup>
            <FormGroupBlock>
              <h2>Endereço:</h2>
              <Input
                name="cep"
                onBlurCapture={e => getAdressByCEP(e.target.value)}
                icon={FiMapPin}
                placeholder="CEP"
              />
              <Input name="street" icon={FiMapPin} placeholder="Rua" />
              <Input name="number" icon={FiMapPin} placeholder="Número" />
              <Input
                name="complement"
                icon={FiMapPin}
                placeholder="Complemento"
              />
              <Input name="neighborhood" icon={FiMapPin} placeholder="Bairro" />
              <Select
                name="city_id"
                value={city}
                isSearchable
                styles={{
                  option: (provided, state) => {
                    return {
                      ...provided,
                      backgroundColor: '#232129',
                      borderBottom: '1px dotted #fff',
                      color: state.isSelected ? '#ff9000' : '#fff',
                      cursor: 'pointer',
                      height: '40px',
                      textAlign: 'left',
                    };
                  },
                  menu: provided => {
                    return {
                      ...provided,
                      border: 0,
                    };
                  },
                  container: (provided, state) => {
                    return {
                      ...provided,
                      border: state.isFocused
                        ? '1px solid #ff9000'
                        : '1px solid #232129',
                      borderRadius: '10px',
                      width: '100%',
                    };
                  },
                  control: (provided, state) => {
                    return {
                      ...provided,
                      backgroundColor: '#232129',
                      color: '#666360',
                      width: '100%',
                      height: '55px',
                      borderColor: '#232129',
                      borderRadius: '10px',
                      textAlign: 'left',
                      boxShadow: 'none',
                      border: state.isFocused
                        ? '1px solid #ff9000'
                        : '1px solid #232129',
                    };
                  },
                  singleValue: (provided, state) => {
                    const opacity = state.isDisabled ? 0.5 : 1;
                    const transition = 'opacity 300ms';

                    return {
                      ...provided,
                      opacity,
                      transition,
                      color: '#fff',
                    };
                  },
                }}
                placeholder="Cidade"
                options={cities}
                isMulti={false}
                onChange={s => {
                  if (s) {
                    setCity(s);
                  }
                }}
              />
            </FormGroupBlock>

            <FormGroupBlock>
              <h2>Representante:</h2>
              <Input
                name="representative_name"
                icon={FiUser}
                placeholder="Nome Representante"
              />
              <Input
                name="mail"
                icon={FiMail}
                placeholder="E-mail Representante"
              />
              <Input
                name="mail2"
                icon={FiMail}
                placeholder="E-mail Secundário"
              />
              <Input
                name="tel"
                icon={FiPhoneCall}
                placeholder="Telefone Principal"
              />
              <Input
                name="tel2"
                icon={FiPhoneCall}
                placeholder="Telefone Secundário"
              />
              <Input name="note" placeholder="Anotação" />
            </FormGroupBlock>
          </FormGroup>

          <div>
            <Button type="submit">Cadastrar Fornecedor</Button>
          </div>
        </Form>
      </Content>
    </Container>
  );
};

export default AddSupplier;
