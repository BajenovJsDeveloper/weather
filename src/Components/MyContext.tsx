import React from 'react';

export interface IObjGrafic {
  arr: Array<Array<number>> | Array<number>;
  tshift: number;
}

export interface IContextProps {
  graficArray: IObjGrafic;
  curItemId: number;
  handleClick: (id: number) => void;
  timeClick: (id: number) => void;
  timeLine: Array<string>;
  timeLineId: number | null;
  graficId: number;
  hdlClickGrafic: (id: number) => void;
}

const Mycontext = React.createContext<Partial<IContextProps>>({} as IContextProps);

export default Mycontext;
