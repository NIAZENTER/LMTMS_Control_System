//import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from 'react';
import HomeTabComponent from "./component/HomeTabComponent";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeTabComponent />}></Route>
          <Route path="/" element={<></>}></Route>
          <Route path="/" element={<></>}></Route>
          <Route path="/" element={<></>}></Route>
          <Route path="/" element={<></>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
