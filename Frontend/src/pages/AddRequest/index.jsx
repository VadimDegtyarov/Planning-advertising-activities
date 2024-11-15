import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from '../../axios';
import styles from './AddRequest.module.scss';
import { selectIsAuth } from "../../redux/slices/auth";

export const AddRequest = () => {
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [Bank, setBank] = useState('');
  const [Following, setFollowing] = useState('');
  const [Purchases, setPurchases] = useState('');
  const [CAge, setCAge] = useState('');
  const [Country, setCountry] = useState('');
  const [profit, setProfit] = useState('');
  const isEditing = Boolean(id);

  const validate = () => {
    const newErrors = {};
    if (title.length < 5) newErrors.title = "Название должно быть длиннее 4 символов";
    if (!Bank || isNaN(Bank) || Bank <= 0) newErrors.Bank = "Введите корректное значение для банка";
    if (!Following || isNaN(Following) || Following <= 0) newErrors.Following = "Введите корректное количество переходов";
    if (!Purchases || isNaN(Purchases) || Purchases <= 0) newErrors.Purchases = "Введите корректное количество покупок";
    if (!CAge || isNaN(CAge) || CAge <= 0) newErrors.CAge = "Введите корректный возраст";
    if (!Country) newErrors.Country = "Введите страну";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("Ошибка загрузки файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
    inputFileRef.current.value = null;  // Сброс значения инпута файла
  };

  const onSubmit = async () => {
    if (!validate()) {
      alert('Заполните все поля корректно');
      return;
    }
    try {
      setLoading(true);

      const fields = {
        title, Bank, Following, Purchases, CAge, Country, imageUrl, profit
      };

      const { data } = isEditing
        ? await axios.patch(`/requests/${id}`, fields)
        : await axios.post('/requests', fields);

      const _id = isEditing ? id : data._id;
      navigate(`/requests/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании запроса');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(`/requests/${id}`).then(({ data }) => {
        setTitle(data.Title);
        setBank(data.Bank);
        setFollowing(data.Following);
        setPurchases(data.Purchases);
        setCAge(data.CAge);
        setCountry(data.Country);
        setImageUrl(data.imageUrl);
        setProfit(0);
      });
    }
  }, [id]);

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок рекламной компании..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        value={Bank}
        onChange={(e) => setBank(e.target.value)}
        classes={{ root: styles.bank }}
        variant="standard"
        placeholder="Банк рекламной компании($)..."
        fullWidth
        error={!!errors.Bank}
        helperText={errors.Bank}
      />
      <div className={styles.editor}>
        <TextField
          value={Following}
          onChange={(e) => setFollowing(e.target.value)}
          variant="standard"
          placeholder="Ожидаемое количество переходов по ссылке..."
          fullWidth
          style={{ marginBottom: '20px' }}
          error={!!errors.Following}
          helperText={errors.Following}
        />
        <TextField
          value={Purchases}
          onChange={(e) => setPurchases(e.target.value)}
          variant="standard"
          placeholder="Ожидаемое количество покупок..."
          fullWidth
          style={{ marginBottom: '20px' }}
          error={!!errors.Purchases}
          helperText={errors.Purchases}
        />
        <TextField
          value={CAge}
          onChange={(e) => setCAge(e.target.value)}
          variant="standard"
          placeholder="Возраст потребителя..."
          fullWidth
          style={{ marginBottom: '20px' }}
          error={!!errors.CAge}
          helperText={errors.CAge}
        />
        <TextField
          value={Country}
          onChange={(e) => setCountry(e.target.value)}
          variant="standard"
          placeholder="Страна, на которую рассчитана реклама..."
          fullWidth
          error={!!errors.Country}
          helperText={errors.Country}
        />

      </div>
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained" disabled={isLoading}>
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
      </div>
    </Paper>
  );
};
