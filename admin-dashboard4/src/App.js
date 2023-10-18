import FirstPage from "./component/FirstPage";
import SignUpPopup from "./component/SignUpPopup";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import React from 'react';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element ={<FirstPage />}  />
        <Route path = "/signin" element ={<SignUpPopup />} />
      </Routes>
    </BrowserRouter>
    
    );
} export default App;