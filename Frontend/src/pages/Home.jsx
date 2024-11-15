import React, { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequests } from '../redux/slices/requests';
import { Request } from '../components/Request';
import { SearchBlock } from '../components/SearchBlock';
import { fetchUserMe } from '../redux/slices/users';

export const Home = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector(state => state.requests);
  const [userData, setUserData] = useState(null);
  const isRequestLoading = requests.status === 'loading';
  const [sortBy, setSortBy] = useState('bydate');
  const [sortDirections, setSortDirections] = useState({
    bydate: 'desc',
    ByNameEmpl: 'desc',
    companyName: 'desc',
    ByBankComp: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    dispatch(fetchUserMe())
      .then((response) => {
        console.log('Response payload:', response.payload); 
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
  
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleSortChange = (newValue) => {
    setSortBy(newValue);
    setSortDirections(prevDirections => {
      const updatedDirections = { ...prevDirections };
      Object.keys(updatedDirections).forEach(key => {
        if (key !== newValue) {
          updatedDirections[key] = 'desc';
        }
      });
      updatedDirections[newValue] = prevDirections[newValue] === 'desc' ? 'asc' : 'desc';
      return updatedDirections;
    });
  };

  const sortRequestsByDate = (a, b) => {
    const multiplier = sortDirections.bydate === 'asc' ? 1 : -1;
    return multiplier * (new Date(b.createdAt) - new Date(a.createdAt));
  };

  const sortRequestsByName = (a, b) => {
    const multiplier = sortDirections.ByNameEmpl === 'asc' ? 1 : -1;
    return multiplier * a.user.fullName.localeCompare(b.user.fullName);
  };

  const sortRequestsByCompanyName = (a, b) => {
    const multiplier = sortDirections.companyName === 'asc' ? 1 : -1;
    return multiplier * a.companyName.localeCompare(b.companyName);
  };

  const sortRequestsByCost = (a, b) => {
    const costA = a.Bank !== undefined ? a.Bank : 0;
    const costB = b.Bank !== undefined ? b.Bank : 0;
    const multiplier = sortDirections.ByBankComp === 'asc' ? 1 : -1;
    return multiplier * (costA - costB);
  };

  let sortedRequests = [...(requests.items || [])];

  switch (sortBy) {
    case 'bydate':
      sortedRequests.sort(sortRequestsByDate);
      break;
    case 'ByNameEmpl':
      sortedRequests.sort(sortRequestsByName);
      break;
    case 'companyName':
      sortedRequests.sort(sortRequestsByCompanyName);
      break;
    case 'ByBankComp':
      sortedRequests.sort(sortRequestsByCost);
      break;
    default:
      sortedRequests = [...(requests.items || [])];
  }

  const filteredRequests = sortedRequests.filter(request => {
    const title = request && request.Title ? request.Title.toLowerCase() : '';
    const fullName = request && request.user && request.user.fullName ? request.user.fullName.toLowerCase() : '';
    const costString = request && request.Bank !== undefined ? request.Bank.toString().toLowerCase() : '';

    return title.includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      costString.includes(searchQuery.toLowerCase());
  });
  
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
        <div style={{ marginRight: 10 }}>Сортировать по:</div>
        <Tabs aria-label="basic tabs example">
          <Tab
            value="bydate"
            label={`Дате создания ${sortDirections.bydate === 'desc' ? '↓' : '↑'}`} // изменено
            onClick={() => handleSortChange('bydate')}
          />
          <Tab
            value="ByNameEmpl"
            label={`Имени сотрудника ${sortDirections.ByNameEmpl === 'desc' ? '↓' : '↑'}`} // изменено
            onClick={() => handleSortChange('ByNameEmpl')}
          />
          <Tab
            value="ByBankComp"
            label={`Стоимости рекламной компании ${sortDirections.ByBankComp === 'desc' ? '↓' : '↑'}`} // изменено
            onClick={() => handleSortChange('ByBankComp')}
          />
        </Tabs>
      </div>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isRequestLoading ? [...Array(5)] : filteredRequests).map((obj, index) => isRequestLoading ? (<Request key={index} isLoading={true} />) :
            (
              <Request
                key={obj._id}
                id={obj._id}
                title={obj.Title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={150}
                commentsCount={3}
                tags={["react", "fun", "typescript"]}
                isEditables={userData?._id === obj?.user?._id}
              />
            ))}
        </Grid>
        <Grid xs={3} item>
          <SearchBlock items={['названию запроса', 'имени сотрудника', 'стоимости рекламы']} setSearchQuery={setSearchQuery} />
        </Grid>
      </Grid>
    </>
  );
};
