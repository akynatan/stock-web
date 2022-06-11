import React, {
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { FiCamera } from 'react-icons/fi';
import Select from 'react-select';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import userImg from '../../assets/user.png';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

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
  ContainerSelect,
  LabelNew,
} from './styles';
import MenuHeader from '../../components/MenuHeader';
import { Model } from '../../types/Model';
import { Category } from '../../types/Category';
import { Manufacturer } from '../../types/Manufacturer';
import { Brand } from '../../types/Brand';
import { Product } from '../../types/Product';

interface AddProductFormData {
  code: string;
  name: string;
  description: string;
  new_brand?: string;
  new_model?: string;
  new_category?: string;
  new_manufacturer?: string;
}

const EditProduct: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const [measures] = useState([
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
  ]);
  const [measureUnit, setMeasureUnit] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >({
    label: 'Unidade',
    value: 'UN',
  });
  const [product, setProduct] = useState<Product | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [model, setModel] = useState<Model | null>(null);
  const [newModel, setNewModel] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState(false);
  const [manufactures, setManufacturers] = useState<Manufacturer[]>([]);
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [newManufacturer, setNewManufacturer] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [newBrand, setNewBrand] = useState(false);

  const { id } = useParams<{ id: string }>();

  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(responseProduct => {
      setProduct(responseProduct.data);
      api.get(`/model`).then(response => {
        const ModelsData = response.data.map((modelCurrent: Model) => ({
          ...modelCurrent,
          value: modelCurrent.id,
          label: modelCurrent.name,
        }));
        setModels(ModelsData);
        setModel(
          ModelsData.find((m: Model) => m.id === responseProduct.data.model_id),
        );
      });

      api.get(`/brand`).then(response => {
        const brandsData = response.data.map((brandCurrent: Brand) => ({
          ...brandCurrent,
          value: brandCurrent.id,
          label: brandCurrent.name,
        }));
        setBrands(brandsData);
        setBrand(
          brandsData.find((b: Brand) => b.id === responseProduct.data.brand_id),
        );
      });

      api.get(`/manufacturer`).then(response => {
        const manufacturersData = response.data.map(
          (manufacturerCurrent: Manufacturer) => ({
            ...manufacturerCurrent,
            value: manufacturerCurrent.id,
            label: manufacturerCurrent.name,
          }),
        );
        setManufacturers(manufacturersData);
        setManufacturer(
          manufacturersData.find(
            (m: Manufacturer) => m.id === responseProduct.data.manufacturer_id,
          ),
        );
      });

      api.get(`/category`).then(response => {
        const categoriesData = response.data.map(
          (categoryCurrent: Category) => ({
            ...categoryCurrent,
            value: categoryCurrent.id,
            label: categoryCurrent.name,
          }),
        );
        setCategories(categoriesData);
        setCategory(
          categoriesData.find(
            (c: Category) => c.id === responseProduct.data.category_id,
          ),
        );
      });

      setMeasureUnit(
        measures.find(m => m.value === responseProduct.data.measure_unit),
      );
    });
  }, [id, measures]);

  const handleSubmit = useCallback(
    async (data: AddProductFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          code: Yup.string()
            .min(5, 'Mínimo 5 caracteres')
            .max(5, 'Maximo 5 caracteres')
            .required('Code obrigatório'),
          description: Yup.string().required('Descrição obrigatória'),
          new_brand: Yup.string(),
          new_model: Yup.string(),
          new_category: Yup.string(),
          new_manufacturer: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          code,
          name,
          description,
          new_brand,
          new_model,
          new_category,
          new_manufacturer,
        } = data;

        const formData = {
          code,
          name,
          description,
          new_brand: new_brand || null,
          brand_id: brand?.id,
          new_model: new_model || null,
          model_id: model?.id,
          new_category: new_category || null,
          category_id: category?.id,
          new_manufacturer: new_manufacturer || null,
          manufacturer_id: manufacturer?.id,
          measure_unit: measureUnit?.value,
        };

        const response = await api.put(`/products/${id}`, formData);

        if (response.data) {
          addToast({
            type: 'success',
            title: 'Produto atualizado!',
            description: 'Produto atualizado com sucesso!',
          });
        }

        // history.push('/products');
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
    [brand, model, category, manufacturer, measureUnit, id, addToast],
  );

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const data = new FormData();

      const { files } = e.target;
      if (files) {
        data.append('image', files[0]);

        api.patch(`/products/${id}/image`, data).then(response => {
          setProduct(response.data);

          addToast({
            type: 'success',
            title: 'Imagem atualizada!',
          });
        });
      }
    },
    [addToast, id],
  );

  const handleNewBrand = useCallback(() => {
    setNewBrand(val => !val);
    setBrand(null);
  }, []);

  const handleNewModel = useCallback(() => {
    setNewModel(val => !val);
    setModel(null);
  }, []);

  const handleNewCategory = useCallback(() => {
    setNewCategory(val => !val);
    setCategory(null);
  }, []);

  const handleNewManufacturer = useCallback(() => {
    setNewManufacturer(val => !val);
    setManufacturer(null);
  }, []);

  return (
    <Container>
      <MenuHeader />

      <Content>
        <Form
          initialData={{
            code: product?.code,
            name: product?.name,
            description: product?.description,
          }}
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <h1>Novo Produto</h1>
          <FormGroup>
            <FormGroupBlock style={{ flex: 1, marginBottom: 20 }}>
              <Avatar>
                <AvatarInput>
                  <img
                    src={product?.image_url ? product?.image_url : userImg}
                    alt={product?.name}
                  />
                  <label htmlFor="avatar">
                    <FiCamera />
                    <input
                      id="avatar"
                      type="file"
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
              <ContainerSelect>
                <Select
                  name="measure_unit"
                  value={measureUnit}
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
                        width: '300px',
                      };
                    },
                    control: (provided, state) => {
                      const opacity = state.isDisabled ? 0.5 : 1;

                      return {
                        ...provided,
                        backgroundColor: '#232129',
                        color: '#666360',
                        width: '100%',
                        opacity,
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
                  placeholder="Unidade de Medida"
                  options={measures}
                  isMulti={false}
                  onChange={s => {
                    if (s) {
                      setMeasureUnit(s);
                    }
                  }}
                />
              </ContainerSelect>
            </FormGroupBlock>

            <FormGroupBlock>
              <ContainerSelect>
                <Select
                  isDisabled={newBrand}
                  name="brand_id"
                  value={brand}
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
                        width: '300px',
                      };
                    },
                    control: (provided, state) => {
                      const opacity = state.isDisabled ? 0.5 : 1;

                      return {
                        ...provided,
                        backgroundColor: '#232129',
                        color: '#666360',
                        width: '100%',
                        opacity,
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
                  placeholder="Marca"
                  options={brands}
                  isMulti={false}
                  onChange={s => {
                    if (s) {
                      setBrand(s);
                    }
                  }}
                />
                <LabelNew htmlFor="show_new_brand">
                  Novo?
                  <input
                    defaultChecked={newBrand}
                    onChange={handleNewBrand}
                    name="show_new_brand"
                    type="checkbox"
                  />
                </LabelNew>
              </ContainerSelect>
              {newBrand && <Input name="new_brand" placeholder="Nova Marca" />}
              <ContainerSelect>
                <Select
                  isDisabled={newModel}
                  name="model_id"
                  value={model}
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
                        width: '300px',
                      };
                    },
                    control: (provided, state) => {
                      const opacity = state.isDisabled ? 0.5 : 1;

                      return {
                        ...provided,
                        backgroundColor: '#232129',
                        color: '#666360',
                        width: '100%',
                        height: '55px',
                        opacity,
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
                  placeholder="Modelo"
                  options={models}
                  isMulti={false}
                  onChange={s => {
                    if (s) {
                      setModel(s);
                    }
                  }}
                />
                <LabelNew htmlFor="new_mshow_new_modelodel">
                  Novo?
                  <input
                    defaultChecked={newModel}
                    onChange={handleNewModel}
                    name="show_new_model"
                    type="checkbox"
                  />
                </LabelNew>
              </ContainerSelect>
              {newModel && <Input name="new_model" placeholder="Novo Modelo" />}
              <ContainerSelect>
                <Select
                  isDisabled={newCategory}
                  name="category_id"
                  value={category}
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
                        width: '300px',
                      };
                    },
                    control: (provided, state) => {
                      const opacity = state.isDisabled ? 0.5 : 1;

                      return {
                        ...provided,
                        backgroundColor: '#232129',
                        color: '#666360',
                        width: '100%',
                        height: '55px',
                        opacity,
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
                  placeholder="Categoria"
                  options={categories}
                  isMulti={false}
                  onChange={s => {
                    if (s) {
                      setCategory(s);
                    }
                  }}
                />
                <LabelNew htmlFor="show_new_category">
                  Novo?
                  <input
                    defaultChecked={newCategory}
                    onChange={handleNewCategory}
                    name="show_new_category"
                    type="checkbox"
                  />
                </LabelNew>
              </ContainerSelect>
              {newCategory && (
                <Input name="new_category" placeholder="Nova Categoria" />
              )}
              <ContainerSelect>
                <Select
                  isDisabled={newManufacturer}
                  name="manufacturer_id"
                  value={manufacturer}
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
                        width: '300px',
                      };
                    },
                    control: (provided, state) => {
                      const opacity = state.isDisabled ? 0.5 : 1;

                      return {
                        ...provided,
                        backgroundColor: '#232129',
                        color: '#666360',
                        width: '100%',
                        height: '55px',
                        borderColor: '#232129',
                        borderRadius: '10px',
                        textAlign: 'left',
                        opacity,
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
                  placeholder="Fabricante"
                  options={manufactures}
                  isMulti={false}
                  onChange={s => {
                    if (s) {
                      setManufacturer(s);
                    }
                  }}
                />
                <LabelNew htmlFor="show_new_manufacturer">
                  Novo?
                  <input
                    defaultChecked={newManufacturer}
                    onChange={handleNewManufacturer}
                    name="show_new_manufacturer"
                    type="checkbox"
                  />
                </LabelNew>
              </ContainerSelect>
              {newManufacturer && (
                <Input name="new_manufacturer" placeholder="Novo Fornecedor" />
              )}
            </FormGroupBlock>
          </FormGroup>

          <div>
            <Button type="submit">Atualizar Produto</Button>
          </div>
        </Form>
      </Content>
    </Container>
  );
};

export default EditProduct;
