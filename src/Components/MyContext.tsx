import React from 'react';
import { IContextProps } from '../Interface/Interfaces';

const Mycontext = React.createContext<Partial<IContextProps>>({} as IContextProps);
export default Mycontext;
