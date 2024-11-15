import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import { fetchRequests } from '../../redux/slices/requests';
import { fetchUserMe } from '../../redux/slices/users';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchUserMe())
        .then((response) => {
          const userData = response.payload.userData;
          setUserData(userData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка при получении данных пользователя:", error);
          setIsLoading(false);
        });

      dispatch(fetchRequests());
    }
  }, [dispatch, isAuth]); // добавлен isAuth в зависимости

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Cource Work</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                {isLoading ? (
                  <div>Загрузка...</div>
                ) : (
                  <>
                    {userData?.isAdmin && (
                      <Link to="/admin">
                        <Button variant="contained" className={styles.adminButton}>Панель админа</Button>
                      </Link>
                    )}
                    <Link to="/add-request">
                      <Button variant="contained">Создать запрос</Button>
                    </Link>
                    <Button onClick={onClickLogout} variant="contained" color="error">
                      Выйти
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
