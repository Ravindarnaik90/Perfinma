import { useContext } from 'react';
import CurrencyContext from '../contexts/CurrencyContext';

const useCurrency = () => {
  return useContext(CurrencyContext);
};

export default useCurrency;