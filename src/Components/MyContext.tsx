import React from 'react';
import {IContextProps} from '../Interface/Interface';

const Mycontext = React.createContext<Partial<IContextProps>>({} as IContextProps);
export default Mycontext;
