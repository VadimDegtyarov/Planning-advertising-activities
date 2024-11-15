import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { fetchUser, fetchUpdateUser } from '../../redux/slices/users';

export const Registration = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(Boolean(id));
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changesSaved, setChangesSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchUser(id))
        .then((res) => {
          if (res.payload) {
            const { fullName, email } = res.payload;
            setValue('fullName', fullName);
            setValue('email', email);
            console.log('User data set:', { fullName, email });
          } else {
            alert('Ошибка при получении данных пользователя');
          }
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении данных пользователя');
        });
    }
  }, [dispatch, isEditing, id, setValue]);

  const onSubmit = async (values) => {
    try {
      let data;
      if (isEditing) {
        values.password=values.newPassword
        data = await dispatch(fetchUpdateUser({ id, data: values }));
        console.log(data);
        setChangesSaved(true);
      } else {
        data = await dispatch(fetchRegister(values));
        if ('token' in data.payload) {
          window.localStorage.setItem('token', data.payload.token);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(isAuth, isEditing);
  if (isAuth && !isEditing) {
    return <Navigate to="/" />;
  }

  const newPassword = watch('newPassword');
  const fullName = watch('fullName');

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        {isEditing ? 'Редактирование аккаунта' : 'Создание аккаунта'}
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {changesSaved && <Typography variant="body1" className={styles.successMessage}>Данные успешно изменены</Typography>}
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          value={fullName}
          onChange={(e) => {
            setValue('fullName', e.target.value);
          }}
          className={styles.field}
          placeholder="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          value={watch('email')}
          onChange={(e) => {
            setValue('email', e.target.value);
          }}
          type="email"
          className={styles.field}
          placeholder="E-Mail"
          fullWidth
        />
        {!isEditing && (
          <TextField
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            type="password"
            {...register('password', { required: 'Укажите пароль' })}
            className={styles.field}
            placeholder="Пароль"
            fullWidth
          />
        )}
        {isEditing && (
          <>
            <TextField
              error={Boolean(errors.newPassword?.message)}
              helperText={errors.newPassword?.message}
              type="password"
              {...register('newPassword', { required: 'Укажите новый пароль' })}
              className={styles.field}
              placeholder="Новый пароль"
              fullWidth
            />
            <TextField
              error={Boolean(errors.confirmNewPassword?.message)}
              helperText={errors.confirmNewPassword?.message}
              type="password"
              {...register('confirmNewPassword', {
                required: 'Подтвердите новый пароль',
                validate: (value) => value === newPassword || 'Пароли не совпадают'
              })}
              className={styles.field}
              placeholder="Подтвердите новый пароль"
              fullWidth
            />
          </>
        )}
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          {isEditing ? 'Сохранить изменения' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Paper>
  );
};
