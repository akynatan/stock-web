/* eslint-disable no-alert */
import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import userImg from '../../assets/user.png';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../Input';
import Select from '../Select';
import Button from '../Button';

import { Avatar, AvatarInput, FormGroup, FormGroupBlock } from './styles';

import { Model, Category, Manufacturer, Brand, Option } from '../../types';

interface IModelOption extends Model, Option {}
interface ICategoryOption extends Category, Option {}
interface IManufacturerOption extends Manufacturer, Option {}
interface IBrandOption extends Brand, Option {}

interface FormProductFormData {
  code: string;
  name: string;
  description: string;
  brand_id: string;
  model_id: string;
  category_id: string;
  manufacturer_id: string;
  measure_unit?: string;
}

interface FormProductProps {
  initialData?: any;
  method: 'edit' | 'add';
  url: string;
}

const FormProduct: React.FC<FormProductProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const history = useHistory();

  const measures = useMemo(
    () => [
      { label: 'Unidade', value: 'UN' },
      { label: 'Tonelada', value: 'T' },
      { label: 'Quilograma', value: 'KG' },
      { label: 'Grama', value: 'G' },
      { label: 'Miligrama', value: 'MG' },
      { label: 'Volume', value: 'V' },
      { label: 'Litro', value: 'L' },
      { label: 'Mililitro', value: 'ML' },
      { label: 'Quilometro', value: 'KM' },
      { label: 'Metro', value: 'M' },
      { label: 'Centimetro', value: 'CM' },
      { label: 'Decimetro', value: 'DM' },
      { label: 'Milimetro', value: 'MM' },
    ],
    [],
  );

  const [models, setModels] = useState<IModelOption[]>([]);
  const [categories, setCategories] = useState<ICategoryOption[]>([]);
  const [manufactures, setManufacturers] = useState<IManufacturerOption[]>([]);
  const [brands, setBrands] = useState<IBrandOption[]>([]);

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    api.get(`/model`).then(response => {
      const ModelsData = response.data.map((modelCurrent: Model) => ({
        ...modelCurrent,
        value: modelCurrent.id,
        label: modelCurrent.name,
      }));
      setModels(ModelsData);
    });

    api.get(`/brand`).then(response => {
      const BrandsData = response.data.map((brandCurrent: Brand) => ({
        ...brandCurrent,
        value: brandCurrent.id,
        label: brandCurrent.name,
      }));
      setBrands(BrandsData);
    });

    api.get(`/manufacturer`).then(response => {
      const ManufacturersData = response.data.map(
        (manufacturerCurrent: Manufacturer) => ({
          ...manufacturerCurrent,
          value: manufacturerCurrent.id,
          label: manufacturerCurrent.name,
        }),
      );
      setManufacturers(ManufacturersData);
    });

    api.get(`/category`).then(response => {
      const CategoriesData = response.data.map((categoryCurrent: Category) => ({
        ...categoryCurrent,
        value: categoryCurrent.id,
        label: categoryCurrent.name,
      }));
      setCategories(CategoriesData);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: FormProductFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          code: Yup.string()
            .min(5, 'Mínimo 5 caracteres')
            .max(5, 'Maximo 5 caracteres')
            .required('Code obrigatório'),
          description: Yup.string().required('Descrição obrigatória'),
          measure_unit: Yup.string().required('Unidade obrigatória'),
          brand_id: Yup.string().required('Campo obrigatório'),
          model_id: Yup.string().required('Campo obrigatório'),
          category_id: Yup.string().required('Campo obrigatório'),
          manufacturer_id: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          code,
          name,
          description,
          measure_unit,
          brand_id,
          model_id,
          category_id,
          manufacturer_id,
        } = data;

        const formData = {
          code,
          name,
          description,
          brand_id,
          model_id,
          category_id,
          manufacturer_id,
          measure_unit,
        };

        const methods = {
          edit: async () => api.put(url, formData),
          add: async () => api.post(url, formData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: 'success',
            title: 'Produto cadastrado!',
            description: 'Novo produto cadastrado com sucesso!',
          });
        }

        history.push('/products');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização!',
          description: err.response?.data?.error,
        });
      }
    },
    [history, method, url, addToast],
  );

  const handleImageChange = useCallback(() => {
    window.alert('Cadastre o produto para poder adicionar uma imagem');
  }, []);

  return (
    <Form ref={formRef} onSubmit={handleSubmit} initialData={initialData}>
      <FormGroup>
        <FormGroupBlock style={{ flex: 1, marginBottom: 20 }}>
          <Avatar>
            <AvatarInput>
              <img src={userImg} alt="Imagem Fornecedor" />
              <label htmlFor="avatar">
                <FiCamera />
                <input
                  id="avatar"
                  type="checkbox"
                  onChange={handleImageChange}
                />
              </label>
            </AvatarInput>
          </Avatar>
        </FormGroupBlock>
      </FormGroup>
      <FormGroup>
        <FormGroupBlock>
          <Input name="code" placeholder="Código" />
          <Input name="name" placeholder="Nome" />
          <Input name="description" placeholder="Descrição" />
          <Select
            name="measure_unit"
            placeholder="Unidade de Medida"
            options={measures}
          />
        </FormGroupBlock>

        <FormGroupBlock>
          <Select
            name="brand_id"
            placeholder="Marca"
            options={brands}
            component="creatable"
          />
          <Select
            name="model_id"
            placeholder="Modelo"
            options={models}
            component="creatable"
          />
          <Select
            name="category_id"
            placeholder="Categoria"
            options={categories}
            component="creatable"
          />
          <Select
            name="manufacturer_id"
            placeholder="Fabricante"
            options={manufactures}
            component="creatable"
          />
        </FormGroupBlock>
      </FormGroup>

      <div>
        <Button type="submit">Cadastrar Produto</Button>
      </div>
    </Form>
  );
};

export default FormProduct;
