/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';

import MenuHeader from '../MenuHeader';
import Button from '../Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import {
  Container,
  Content,
  HeaderPage,
  ModalOverlay,
  ModalContent,
} from './styles';

interface Entity {
  id: string;
  name: string;
}

interface CrudPageProps {
  title: string;
  endpoint: string;
}

const CrudPage: React.FC<CrudPageProps> = ({ title, endpoint }) => {
  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [items, setItems] = useState<Entity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Entity | null>(null);
  const [inputValue, setInputValue] = useState('');

  const loadItems = useCallback(() => {
    setIsFetching(true);
    api
      .get(endpoint)
      .then(res => setItems(res.data))
      .finally(() => setIsFetching(false));
  }, [endpoint]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setInputValue('');
    setShowModal(true);
  }, []);

  const handleOpenEdit = useCallback((item: Entity) => {
    setEditingItem(item);
    setInputValue(item.name);
    setShowModal(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!inputValue.trim()) {
      addToast({ type: 'error', title: 'Nome é obrigatório' });
      return;
    }

    try {
      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id}`, { name: inputValue });
        addToast({ type: 'success', title: 'Atualizado com sucesso!' });
      } else {
        await api.post(endpoint, { name: inputValue });
        addToast({ type: 'success', title: 'Criado com sucesso!' });
      }
      setShowModal(false);
      loadItems();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro ao salvar',
        description: err.response?.data?.error,
      });
    }
  }, [inputValue, editingItem, endpoint, addToast, loadItems]);

  const handleDelete = useCallback(
    (item: Entity) => {
      const confirm = window.confirm(`Deseja apagar "${item.name}"?`);
      if (!confirm) return;

      api
        .delete(`${endpoint}/${item.id}`)
        .then(() => {
          setItems(val => val.filter(i => i.id !== item.id));
          addToast({ type: 'success', title: 'Apagado com sucesso!' });
        })
        .catch((err: any) => {
          addToast({
            type: 'error',
            title: 'Erro ao apagar',
            description: err.response?.data?.error,
          });
        });
    },
    [endpoint, addToast],
  );

  return (
    <Container>
      <MenuHeader />

      <Content>
        <HeaderPage>
          <div>
            <h1>{title}</h1>
            <hr />
          </div>
          <Button type="button" onClick={handleOpenCreate}>
            Adicionar
          </Button>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <HiPencil onClick={() => handleOpenEdit(item)} />
                  <MdDelete onClick={() => handleDelete(item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isFetching && <p className="fetching">Carregando...</p>}
        {!isFetching && items.length === 0 && (
          <p>Nenhum registro encontrado.</p>
        )}
      </Content>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2>{editingItem ? 'Editar' : 'Novo'}</h2>
            <input
              placeholder="Nome"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <div>
              <Button type="button" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSave}>
                Salvar
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CrudPage;
