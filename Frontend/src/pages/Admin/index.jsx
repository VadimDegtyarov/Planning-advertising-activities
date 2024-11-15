import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests, fetchRemoveRequest } from '../../redux/slices/requests';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { fetchUsers, deleteUser } from '../../redux/slices/users';
import { Bolt } from '@mui/icons-material';

export const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersStatus, setUsersStatus] = useState('idle');
  const [usersError, setUsersError] = useState(null);
  const { requests } = useSelector(state => state.requests);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setUsersStatus('loading');
        const userData = await dispatch(fetchUsers());
        setUsers(userData.payload);
        setUsersStatus('loaded');
      } catch (error) {
        setUsers([]);
        setUsersError(error.message);
        setUsersStatus('error');
      }
    };

    fetchUsersData();
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    if (window.confirm('Вы действительно хотите удалить этого пользователя?')) {
      dispatch(deleteUser(id));
      setUsers(users.filter(user => user._id !== id));
    }
  };

  const handleDeleteRequest = (id) => {
    if (window.confirm('Вы действительно хотите удалить этот запрос?')) {
      dispatch(fetchRemoveRequest(id));
    }
  };

  if (usersStatus === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (usersError) {
    return <div>Ошибка: {usersError}</div>;
  }
  console.log(requests)
  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Paper style={{ padding: 20 }}>
          <h2>Пользователи</h2>
          <ul>
            {users && users.map(user => (
              <li key={user._id}>
             {user.isAdmin ? <span style={{fontWeight: 'bold'}}>(Admin)</span> : null} {user.fullName} ({user.email}) 



                <Button onClick={() => navigate(`/admin/${user._id}/edit`)}>Редактировать</Button>
                <Button onClick={() => handleDeleteUser(user._id)} color="error">Удалить</Button>
              </li>
            ))}
          </ul>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{ padding: 20 }}>
          <h2>Запросы</h2>
          <ul>
            {requests && Array.isArray(requests.items) && requests.items.map(request => (
              <li key={request._id}>
                {request.Title}
                <Button onClick={() => navigate(`/requests/${request._id}/edit`)}>Редактировать</Button>
                <Button onClick={() => handleDeleteRequest(request._id)} color="error">Удалить</Button>
              </li>
            ))}

          </ul>
        </Paper>
      </Grid>
    </Grid>
  );
};
