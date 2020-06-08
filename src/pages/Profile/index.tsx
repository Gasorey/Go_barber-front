import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../hooks/toast';

import { Container, Content } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(8, 'No mínimo 8 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucesso',
          description: 'Você já pode fazer seu logon no Go Barber!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no cadastro ',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="SignUp Background" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />
          <Button type="submit">Cadastrar</Button>
        </Form>
        <Link to="/">
          <FiArrowLeft />
          Voltar para Log On
        </Link>
      </Content>
    </Container>
  );
};

export default Profile;
