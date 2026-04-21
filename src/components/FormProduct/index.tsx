/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  ChangeEvent,
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

import {
  Model,
  Category,
  Manufacturer,
  Brand,
  Option,
  Product,
} from '../../types';

interface IModelOption extends Model, Option {}
interface ICategoryOption extends Category, Option {}
interface IManufacturerOption extends Manufacturer, Option {}
interface IBrandOption extends Brand, Option {}

interface QuickAddModal {
  label: string;
  endpoint: string;
  onCreated: (item: { id: string; name: string }) => void;
}

interface FormProductFormData {
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

  const [product, setProduct] = useState<Product | null>(null);

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

  const [quickAddModal, setQuickAddModal] = useState<QuickAddModal | null>(
    null,
  );
  const [quickAddValue, setQuickAddValue] = useState('');

  const formRef = useRef<FormHandles>(null);

  const handleQuickAdd = useCallback(async () => {
    if (!quickAddModal || !quickAddValue.trim()) return;

    try {
      const response = await api.post(quickAddModal.endpoint, {
        name: quickAddValue,
      });
      quickAddModal.onCreated(response.data);
      addToast({ type: 'success', title: `${quickAddModal.label} criado!` });
      setQuickAddModal(null);
      setQuickAddValue('');
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro ao criar',
        description: err.response?.data?.error,
      });
    }
  }, [quickAddModal, quickAddValue, addToast]);

  const openQuickAdd = useCallback(
    (
      label: string,
      endpoint: string,
      onCreated: (item: { id: string; name: string }) => void,
    ) => {
      setQuickAddValue('');
      setQuickAddModal({ label, endpoint, onCreated });
    },
    [],
  );

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
          name,
          description,
          measure_unit,
          brand_id,
          model_id,
          category_id,
          manufacturer_id,
        } = data;

        const formData = {
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

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (method === 'add') {
        return window.alert(
          'Cadastre o produto para poder adicionar uma imagem',
        );
      }

      const data = new FormData();

      const { files } = e.target;
      if (files) {
        data.append('image', files[0]);

        api.patch(`/products/${initialData?.id}/image`, data).then(response => {
          setProduct(response.data);

          addToast({
            type: 'success',
            title: 'Imagem atualizada!',
          });
        });
      }
    },
    [addToast, initialData?.id, method],
  );

  return (
    <Form ref={formRef} onSubmit={handleSubmit} initialData={initialData}>
      <FormGroup>
        <FormGroupBlock style={{ flex: 1, marginBottom: 20 }}>
          <Avatar>
            <AvatarInput>
              <img
                src={
                  initialData?.image_url
                    ? initialData.image_url
                    : product?.image_url
                    ? product?.image_url
                    : userImg
                }
                alt="Imagem Fornecedor"
              />
              <label htmlFor="avatar">
                <FiCamera />
                <input id="avatar" type="file" onChange={handleImageChange} />
              </label>
            </AvatarInput>
          </Avatar>
        </FormGroupBlock>
      </FormGroup>
      <FormGroup>
        <FormGroupBlock>
          <Input name="name" placeholder="Nome" />
          <Input name="description" placeholder="Descrição" />
          <Select
            name="measure_unit"
            placeholder="Unidade de Medida"
            options={measures}
          />
        </FormGroupBlock>

        <FormGroupBlock>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              name="brand_id"
              placeholder="Marca"
              options={brands}
              component="creatable"
            />
            <button
              type="button"
              onClick={() => {
                openQuickAdd('Marca', '/brand', item => {
                  console.log;
                  setBrands(prev => [
                    ...prev,
                    { ...item, value: item.id, label: item.name } as any,
                  ]);
                });
              }}
              style={{
                background: '#ff9000',
                border: 0,
                borderRadius: '50%',
                width: 36,
                height: 36,
                color: '#312e38',
                fontSize: 22,
                fontWeight: 'bold',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              name="model_id"
              placeholder="Modelo"
              options={models}
              component="creatable"
            />
            <button
              type="button"
              onClick={() => {
                openQuickAdd('Modelo', '/model', item => {
                  setModels(prev => [
                    ...prev,
                    { ...item, value: item.id, label: item.name } as any,
                  ]);
                });
              }}
              style={{
                background: '#ff9000',
                border: 0,
                borderRadius: '50%',
                width: 36,
                height: 36,
                color: '#312e38',
                fontSize: 22,
                fontWeight: 'bold',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              name="category_id"
              placeholder="Categoria"
              options={categories}
              component="creatable"
            />
            <button
              type="button"
              onClick={() => {
                openQuickAdd('Categoria', '/category', item => {
                  setCategories(prev => [
                    ...prev,
                    { ...item, value: item.id, label: item.name } as any,
                  ]);
                });
              }}
              style={{
                background: '#ff9000',
                border: 0,
                borderRadius: '50%',
                width: 36,
                height: 36,
                color: '#312e38',
                fontSize: 22,
                fontWeight: 'bold',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Select
              name="manufacturer_id"
              placeholder="Fabricante"
              options={manufactures}
              component="creatable"
            />
            <button
              type="button"
              onClick={() => {
                openQuickAdd('Fabricante', '/manufacturer', item => {
                  setManufacturers(prev => [
                    ...prev,
                    { ...item, value: item.id, label: item.name } as any,
                  ]);
                });
              }}
              style={{
                background: '#ff9000',
                border: 0,
                borderRadius: '50%',
                width: 36,
                height: 36,
                color: '#312e38',
                fontSize: 22,
                fontWeight: 'bold',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
        </FormGroupBlock>
      </FormGroup>

      <div>
        <Button type="submit">Cadastrar Produto</Button>
      </div>

      {quickAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setQuickAddModal(null)}
          role="presentation"
        >
          <div
            style={{
              background: '#312e38',
              borderRadius: 10,
              padding: 40,
              width: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={e => e.stopPropagation()}
            role="presentation"
          >
            <h2 style={{ color: '#ff9000', marginBottom: 24 }}>
              Novo(a) {quickAddModal.label}
            </h2>
            <input
              placeholder="Nome"
              value={quickAddValue}
              onChange={e => setQuickAddValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuickAdd()}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              style={{
                background: '#232129',
                borderRadius: 10,
                border: '2px solid #232129',
                padding: 16,
                width: '100%',
                color: '#f4ede8',
                fontSize: 16,
                marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <Button
                type="button"
                onClick={() => setQuickAddModal(null)}
                style={{ flex: 1 }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleQuickAdd}
                style={{ flex: 1 }}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};

export default FormProduct;
