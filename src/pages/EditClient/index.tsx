/* eslint-disable no-useless-escape */
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FiMail, FiUser, FiMapPin, FiPhoneCall, FiBook } from 'react-icons/fi';
import Select from 'react-select';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import getDataByCep from 'cep-promise';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, FormGroup, FormGroupBlock } from './styles';
import MenuHeader from '../../components/MenuHeader';
import { City } from '../../types/City';
import { Client } from '../../types/Client';

interface AddClientFormData {
  name: string;
  document: string;
  tel: string;
  tel2: string;
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

const EditClient: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const [client, setClient] = useState<Client | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City | null>(null);

  const formRef = useRef<FormHandles>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/client/${id}`).then(response => {
      setClient(response.data);

      api.get(`/city`).then(responseCity => {
        const CitiesData = responseCity.data.map((cityCurrent: City) => ({
          ...cityCurrent,
          value: cityCurrent.id,
          label: cityCurrent.name,
        }));

        setCity(CitiesData.find((c: City) => c.id === response.data.city_id));
        setCities(CitiesData);
      });
    });
  }, [id]);

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
          tel: Yup.string(),
          tel2: Yup.string(),
          neighborhood: Yup.string(),
          street: Yup.string(),
          cep: Yup.string()
            .min(8, 'Mínimo 8 caracteres')
            .max(8, 'Máximo 8 caracteres')
            .required('CEP obrigatório'),
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
          city_id: city?.id,
          cep,
          number,
          complement,
          mail,
          note,
        };

        const response = await api.put(`/client/${id}`, formData);

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
    [addToast, city, history, id],
  );

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
        <Form
          initialData={{
            name: client?.name,
            document: client?.document,
            tel: client?.tel,
            tel2: client?.tel2,
            neighborhood: client?.neighborhood,
            street: client?.street,
            cep: client?.cep,
            number: client?.number,
            complement: client?.complement,
            mail: client?.mail,
            note: client?.note,
          }}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <h1>Editar Cliente</h1>
          <FormGroup>
            <FormGroupBlock>
              <h2>Dados pessoais:</h2>
              <Input name="name" icon={FiUser} placeholder="Nome " />
              <Input name="document" icon={FiUser} placeholder="Documento" />
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
              <Input name="mail" icon={FiMail} placeholder="E-mail" />
              <Input name="note" icon={FiBook} placeholder="Anotação" />
            </FormGroupBlock>
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
          </FormGroup>

          <div>
            <Button type="submit">Atualizar Cliente</Button>
          </div>
        </Form>
      </Content>
    </Container>
  );
};

export default EditClient;
