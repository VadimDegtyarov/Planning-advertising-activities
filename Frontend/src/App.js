import Container from "@mui/material/Container";
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from "./components";
import React from "react";
import { Home, FullRequest, Registration, AddRequest, Login, Admin } from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";





function App() {

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);


  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/requests/:id" element={<FullRequest />} />
          <Route path="/requests/:id/edit" element={<AddRequest />} />
          <Route path="/add-request" element={<AddRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:id/edit" element={<Registration />} />

        </Routes>

      </Container>
    </>
  );
}

export default App;
