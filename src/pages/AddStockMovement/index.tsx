import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import MenuHeader from '../../components/MenuHeader';
import GoBack from '../../components/GoBack';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';

import { Container, Content, ContentPage } from './styles';

import { Supplier, Client, Product } from '../../types';

interface Option {
  label: string;
  value: string;
}

interface StockMovementFormData {
  product_id: string;
  quantity: string;
  reason: string;
  supplier_id: string;
  client_id: string;
}

const AddStockMovement: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();

  const formRef = useRef<FormHandles>(null);

  const [movementType, setMovementType] = useState('');
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [clients, setClients] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    api.get('/suppliers').then(response => {
      const suppliersData = response.data.map((supplier: Supplier) => ({
        label: supplier.name_fantasy || supplier.name_social_reason,
        value: supplier.id,
      }));
      setSuppliers(suppliersData);
    });

    api.get('/client').then(response => {
      const clientsData = response.data.map((client: Client) => ({
        label: client.name,
        value: client.id,
      }));
      setClients(clientsData);
    });

    if (!id) {
      api.get('/products').then(response => {
        const productsData = response.data.map((product: Product) => ({
          label: `${product.code} - ${product.name}`,
          value: product.id,
        }));
        setProducts(productsData);
      });
    } else {
      api.get(`/products/${id}`).then(response => {
        setProductName(response.data.name);
      });
    }
  }, [id]);

  const handleSubmit = useCallback(
    async (data: StockMovementFormData) => {
      formRef.current?.setErrors({});

      try {
        const productId = id || data.product_id;

        const formData = {
          ...data,
          product_id: productId,
          type: movementType,
        };

        const schema = Yup.object().shape({
          product_id: Yup.string().required('Produto obrigatório'),
          type: Yup.string().required('Tipo obrigatório'),
          quantity: Yup.number()
            .typeError('Quantidade deve ser um número')
            .positive('Quantidade deve ser maior que zero')
            .required('Quantidade obrigatória'),
          reason: Yup.string().required('Motivo obrigatório'),
          supplier_id: Yup.string().when('type', {
            is: 'entrada',
            then: Yup.string().required('Fornecedor obrigatório'),
          }),
          client_id: Yup.string().when('type', {
            is: 'saida',
            then: Yup.string().required('Cliente obrigatório'),
          }),
        });

        await schema.validate(formData, {
          abortEarly: false,
        });

        const { quantity, reason, supplier_id, client_id } = data;

        const requestData: any = {
          product_id: productId,
          type: movementType,
          quantity: Number(quantity),
          reason,
        };

        if (movementType === 'entrada' && supplier_id) {
          requestData.supplier_id = supplier_id;
        }

        if (movementType === 'saida' && client_id) {
          requestData.client_id = client_id;
        }

        await api.post('/stock_movements', requestData);

        addToast({
          type: 'success',
          title: 'Movimentação registrada!',
          description: 'Movimentação de estoque registrada com sucesso!',
        });

        if (id) {
          history.push(`/product/${id}/stock-movements`);
        } else {
          history.push('/stock-movements');
        }
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao registrar movimentação!',
          description: err.response?.data?.error,
        });
      }
    },
    [id, history, addToast, movementType],
  );

  return (
    <Container>
      <MenuHeader />

      <ContentPage>
        <Content>
          <GoBack />
          <h1>
            {productName
              ? `${productName} - Nova Movimentação`
              : 'Nova Movimentação de Estoque'}
          </h1>

          <Form ref={formRef} onSubmit={handleSubmit}>
            {!id && (
              <Select
                name="product_id"
                placeholder="Selecione o Produto"
                options={products}
              />
            )}

            <select
              name="type"
              value={movementType}
              onChange={e => setMovementType(e.target.value)}
              style={{
                width: '300px',
                height: '55px',
                backgroundColor: '#232129',
                color: movementType ? '#fff' : '#666360',
                border: '2px solid #232129',
                borderRadius: '10px',
                padding: '0 16px',
                fontSize: '16px',
                marginBottom: '8px',
              }}
            >
              <option value="" disabled>
                Tipo de Movimentação
              </option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>

            <Input name="quantity" placeholder="Quantidade" type="number" />

            <Input name="reason" placeholder="Motivo" />

            {movementType === 'entrada' && (
              <Select
                name="supplier_id"
                placeholder="Fornecedor"
                options={suppliers}
              />
            )}

            {movementType === 'saida' && (
              <Select
                name="client_id"
                placeholder="Cliente"
                options={clients}
              />
            )}

            <Button type="submit">Registrar Movimentação</Button>
          </Form>
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddStockMovement;
