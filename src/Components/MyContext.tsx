import React from 'react';
import { ContextProps } from '../Interface/Interfaces';

const Mycontext = React.createContext<Partial<ContextProps>>({} as ContextProps);
export default Mycontext;
