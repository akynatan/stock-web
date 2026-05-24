/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { FiTrash2 } from 'react-icons/fi';

import {
    Container,
    Content,
    HeaderPage,
    ModalOverlay,
    ModalContent,
} from './styles';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { User } from '../../types/User';

const Users: React.FC = () => {
    const { addToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'user' | 'admin'>('user');
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const loadUsers = useCallback(() => {
        setIsFetching(true);
        api
            .get('/users')
            .then(res => {
                setUsers(res.data);
            })
            .finally(() => {
                setIsFetching(false);
            });
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleOpenInvite = useCallback(() => {
        setInviteEmail('');
        setInviteRole('user');
        setShowInviteModal(true);
    }, []);

    const handleCloseInvite = useCallback(() => {
        setShowInviteModal(false);
    }, []);

    const handleSubmitInvite = useCallback(async () => {
        if (!inviteEmail.trim()) {
            addToast({
                type: 'error',
                title: 'E-mail é obrigatório',
            });
            return;
        }

        try {
            await api.post('/users/invite', {
                email: inviteEmail,
                role: inviteRole,
            });
            addToast({
                type: 'success',
                title: 'Convite enviado com sucesso!',
            });
            setShowInviteModal(false);
            loadUsers();
        } catch (err: any) {
            addToast({
                type: 'error',
                title: 'Erro ao enviar convite',
                description: err.response?.data?.error,
            });
        }
    }, [inviteEmail, inviteRole, addToast, loadUsers]);

    const handleOpenEdit = useCallback((user: User) => {
        setEditName(user.name ?? '');
        setEditEmail(user.email);
        setEditingUser(user);
    }, []);

    const handleCloseEdit = useCallback(() => {
        setEditingUser(null);
    }, []);

    const handleSubmitEdit = useCallback(async () => {
        if (!editingUser) {
            return;
        }

        if (!editName.trim() || !editEmail.trim()) {
            addToast({
                type: 'error',
                title: 'Nome e e-mail são obrigatórios',
            });
            return;
        }

        try {
            const response = await api.put(`/users/${editingUser.id}`, {
                name: editName,
                email: editEmail,
            });
            addToast({
                type: 'success',
                title: 'Usuário atualizado com sucesso!',
            });
            setUsers(prev =>
                prev.map(u => (u.id === editingUser.id ? response.data : u)),
            );
            setEditingUser(null);
        } catch (err: any) {
            addToast({
                type: 'error',
                title: 'Erro ao atualizar usuário',
                description: err.response?.data?.error,
            });
        }
    }, [editingUser, editName, editEmail, addToast]);

    const handleDelete = useCallback(
        async (user: User) => {
            const confirmed = window.confirm(
                `Deseja remover o acesso de ${user.name ?? user.email}?`,
            );
            if (!confirmed) {
                return;
            }

            try {
                await api.delete(`/users/${user.id}`);
                addToast({
                    type: 'success',
                    title: 'Usuário removido com sucesso!',
                });
                setUsers(prev => prev.filter(u => u.id !== user.id));
            } catch (err: any) {
                addToast({
                    type: 'error',
                    title: 'Erro ao remover usuário',
                    description: err.response?.data?.error,
                });
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <HeaderPage>
                    <div>
                        <h1>Usuários</h1>
                        <hr />
                    </div>
                    <Button type="button" onClick={handleOpenInvite}>
                        Convidar Usuário
                    </Button>
                </HeaderPage>

                <table>
                    <thead>
                        <tr className="table100-head">
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Papel</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="column1">{user.name ?? '-'}</td>
                                <td className="column2">{user.email}</td>
                                <td className="column3">{user.role}</td>
                                <td className="column4">
                                    <HiPencil onClick={() => handleOpenEdit(user)} />
                                    <FiTrash2 onClick={() => handleDelete(user)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isFetching && <p className="fetching">Carregando...</p>}
                {!isFetching && users.length === 0 && (
                    <p>Nenhum usuário cadastrado.</p>
                )}
            </Content>

            {showInviteModal && (
                <ModalOverlay onClick={handleCloseInvite}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h2>Convidar Usuário</h2>
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            autoFocus
                        />
                        <select
                            value={inviteRole}
                            onChange={e =>
                                setInviteRole(e.target.value as 'user' | 'admin')
                            }
                        >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                        <div>
                            <Button type="button" onClick={handleCloseInvite}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleSubmitInvite}>
                                Enviar Convite
                            </Button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}

            {editingUser !== null && (
                <ModalOverlay onClick={handleCloseEdit}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h2>Editar Usuário</h2>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={editEmail}
                            onChange={e => setEditEmail(e.target.value)}
                        />
                        <div>
                            <Button type="button" onClick={handleCloseEdit}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={handleSubmitEdit}>
                                Salvar
                            </Button>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default Users;
