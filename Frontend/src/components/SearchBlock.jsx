import React, { useState } from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import TextField from '@mui/material/TextField';

export const SearchBlock = ({ items, isLoading, setSearchQuery }) => {
  const handleItemClick = (name) => {
    setSearchQuery(name);
  };

  // Создаем объект состояния для хранения значений каждого поля ввода
  const [searchItems, setSearchItems] = useState({});

  // Функция для обновления состояния поля ввода по его индексу
  const handleInputChange = (index, value) => {
    setSearchItems({ ...searchItems, [index]: value });
    setSearchQuery(value);
  };

  return (
    <div>
      <h3>Поиск по:</h3>
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <ListItem key={i} disablePadding>
            <ListItemIcon>
              <TagIcon />
            </ListItemIcon>
            {isLoading ? (
              <TextField value="" variant="standard" disabled fullWidth />
            ) : (
              <TextField
                value={searchItems[i] || ''}
                onChange={(e) => handleInputChange(i, e.target.value)}
                variant="standard"
                placeholder={name}
                fullWidth
              />
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};