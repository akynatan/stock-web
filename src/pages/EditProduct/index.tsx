import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../services/api';
import GoBack from '../../components/GoBack';

import { Container, Content } from './styles';
import MenuHeader from '../../components/MenuHeader';
import { Product } from '../../types';
import FormProduct from '../../components/FormProduct';

const EditProduct: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/products/${id}`).then(response => {
      setProduct(response.data);
    });
  }, [id]);

  return (
    <Container>
      <MenuHeader />

      <Content>
        <GoBack />
        <h1>Novo Produto</h1>

        <FormProduct
          initialData={{
            code: product?.code,
            name: product?.name,
            description: product?.description,
            measure_unit: {
              label: product?.measure_unit,
              value: product?.measure_unit,
            },
            brand_id: {
              ...product?.brand,
              label: product?.brand?.name,
              value: product?.brand?.id,
            },
            model_id: {
              ...product?.model,
              label: product?.model?.name,
              value: product?.model?.id,
            },
            category_id: {
              ...product?.category,
              label: product?.category?.name,
              value: product?.model?.id,
            },
            manufacturer_id: {
              ...product?.manufacturer,
              label: product?.manufacturer?.name,
              value: product?.model?.id,
            },
          }}
          url={`/product/${id}`}
          method="edit"
        />
      </Content>
    </Container>
  );
};

export default EditProduct;
