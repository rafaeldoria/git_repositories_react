import React from 'react';

import Routes from './routes';
import GlobalStyle from './styles/globalStyles';
import { BrowserRouter } from 'react-router-dom';

const App = () => (
  <BrowserRouter>
    <GlobalStyle />
    <Routes />
  </BrowserRouter>
)

export default App;
