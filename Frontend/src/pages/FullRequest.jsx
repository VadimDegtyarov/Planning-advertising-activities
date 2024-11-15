import React, { useState, useEffect } from "react";
import { Request } from "../components/Request";
import TextField from '@mui/material/TextField';
import styles from './AddRequest/AddRequest.module.scss';
import axios from '../axios';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
export const FullRequest = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();
  const [profit, setProfit] = React.useState('');

  React.useEffect(() => {
    if (id) {
      axios.get(`/requests/${id}`)
        .then((res) => {
          setData(res.data);
          setLoading(false);
          
          setProfit(res.data.profit);
        })
        .catch((err) => {
          console.warn(err);
          alert("ошибка при получении запроса");
        });
    }
  }, [id]);
  
  
  return (
    <>
      {isLoading ? (
        <Request isLoading={isLoading} isFullRequest />
      ) : (
        <>
        
          <Request
            id={data._id}
            title={data.Title}
            bank={data.Bank}
            following={data.Following}
            purchases={data.Purchases}
            cAge={data.CAge}
            country={data.Country}
            imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
            user={data.user}
            createdAt={data.createdAt}
            tags={["react", "fun", "typescript"]} 
            isFullRequest
            isEditables={data.isEditable}
            profit={data.profit}
          >
            <p>
              {data.text}
            </p>
            
          </Request>
         
         
        </>
      )}
    </>
  );
};
