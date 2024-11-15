import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchRemoveRequest } from '../../redux/slices/requests';
import { UserInfo } from '../UserInfo';
import { RequestSkeleton } from './Skeleton';
import styles from './Request.module.scss';
import axios from '../../axios';
import { fetchUserMe } from '../../redux/slices/users';

export const Request = ({
  id,
  title,
  bank,
  following,
  purchases,
  cAge,
  country,
  imageUrl,
  user,
  createdAt,
  isFullRequest,
  isLoading,
  profit,
  isEditables,
  isAdmin
}) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    profit: '',
    roas: profit
  });

  useEffect(() => {
    dispatch(fetchUserMe())
      .then((response) => {
        if (response.payload) {
          const userData = response.payload.userData;
          setUserData(userData);
        } else {
          console.error("Response payload is empty:", response);
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных пользователя:", error);
      });
  }, [dispatch, id]);

  const isEditable = userData && userData._id === id;

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить?')) {
      dispatch(fetchRemoveRequest(id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCalculateRoas = async () => {
    if (bank > 0 && formData.profit > 0) {
      const calculatedRoas = ((formData.profit / bank) * 100).toFixed(2);
      setFormData(prevState => ({
        ...prevState,
        roas: calculatedRoas
      }));
      const fields = {
        title,
        bank,
        following,
        purchases,
        cAge,
        country,
        profit: calculatedRoas
      };
      try {
        await axios.patch(`/requests/${id}`, fields);
      } catch (error) {
        console.error('Ошибка при обновлении ROAS:', error);
      }
    } else {
      alert('Введите корректные значения прибыли и стоимости рекламной кампании.');
    }
  };

  if (isLoading) {
    return <RequestSkeleton />;
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullRequest })}>
      {isEditables && (
        <div className={styles.editButtons}>
          <Link to={`/requests/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullRequest })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullRequest })}>
            {isFullRequest ? title : <Link to={`/requests/${id}`}>{title}</Link>}
          </h2>
          {isFullRequest && (
            <>
              <p className={styles.ROAS}>Рентабельность рекламных расходов(ROAS): {formData.roas}%</p>
              <p>Стоимость рекламной компании: {bank.toLocaleString()},00 $</p>
              <p>Количество привлеченных пользователей: {following} чел.</p>
              <p>Количество купленного рекламируемого товара: {purchases} шт.</p>
              <p>Возраст, на который рассчитана реклама: {cAge} лет.</p>
              <p>Страна, на которую рассчитана реклама: {country}.</p>
              { (
                <div className={styles.Button}>
                  <TextField
                    variant="standard"
                    placeholder="Полученная прибыль..."
                    name="profit"
                    value={formData.profit}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </>
          )}
          {isFullRequest && (
            <div className={styles.Button}>
              <Button variant="contained" onClick={handleCalculateRoas}>Рассчитать ROAS</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
