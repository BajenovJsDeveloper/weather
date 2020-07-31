import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import '../main.scss';
import axios from 'axios';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Weather from './Weather';
import Grafic from './Grafic';
import Hourly from './Hourly';
import loadingSpin from '../img/Rolling-1s-200px.png';
import Mycontext from './MyContext';
import { initialData, dataInit } from '../Interface/initialData';
import {
  IButtonsNavProps,
  IdayDiscr,
  IWeatherGraficProps,
  Rref,
  IWeatherForDayProps,
  IWeatherCardsProps,
  IMainProps,
  ITimeLineProps,
  IHourly,
  IWeatherList,
  IObj,
  IContextProps,
  IObjGrafic,

} from '../Interface/Interface';

const graficInit: IObjGrafic = {
  arr: [0],
  tshift: 0,
};

const ButtonsNav: React.FC<IButtonsNavProps> = (props: IButtonsNavProps) => {
  const { hdlClickGrafic, butonId } = props;

  const btnClick: (id: number) => void = id => {
    hdlClickGrafic(id);
  };

  return (
    <>
      <button name="temp" disabled={butonId === 0 ? true : false} onClick={() => btnClick(0)}>
        Temperature
      </button>
      <button name="rain" disabled={butonId === 1 ? true : false} onClick={() => btnClick(1)}>
        Chance of rain
      </button>
      <button name="wind" disabled={butonId === 2 ? true : false} onClick={() => btnClick(2)}>
        Wind
      </button>
    </>
  );
};

const WeatherDayDisc: React.FC<IdayDiscr> = (props: IdayDiscr) => {
  const { dayDiscr } = props;
  const value = useContext(Mycontext);
  return (
    <>
      <div className="mam-img">
        <img
          alt="w-img"
          src={`https://openweathermap.org/img/wn/${dayDiscr.curTimeWeatherImg}@2x.png`}
        />
      </div>
      <div className="mamh-temp">
        <p>{`${dayDiscr.temperature}`}</p>
      </div>
      <small>&deg;C</small>
      <div className="mamh-info">
        <p>{`Chance of rain: ${dayDiscr.pop}%`}</p>
        <p>{`Humidity: ${dayDiscr.humidity}%`}</p>
        <p>{`Wind: ${dayDiscr.windSpeed}m/s`}</p>
        <ButtonsNav
          hdlClickGrafic={value.hdlClickGrafic || function () {}}
          butonId={value.graficId || 0}
        />
      </div>
    </>
  );
};

const WeatherGrafic: React.FC<IWeatherGraficProps> = React.memo((props: IWeatherGraficProps) => {
  const { graficArray, curItemId, graficId } = props;
  const ref: React.RefObject<Rref> = React.createRef();

  useEffect(() => {
    Grafic.init(600, 130, 5, ref.current, graficId);
    Grafic.draw(graficArray.arr);
  }, [graficArray.arr, graficId, ref]);

  useEffect(() => {
    Grafic.slide(curItemId, graficArray.tshift);
  }, [curItemId, graficArray.tshift]);

  return (
    <>
      <canvas id="grafic" ref={ref} />
    </>
  );
});

const WeatherForDay: React.FC<IWeatherForDayProps> = React.memo((props: IWeatherForDayProps) => {
  const { dataList, curItemId, timeLineId } = props;
  const { graficArray = graficInit, graficId } = useContext(Mycontext);

  Hourly.init(dataList, curItemId);
  const dayDiscr = {
    weekDay: Hourly.getWeekDay(),
    humidity: 
      timeLineId !== null ? Hourly.getHumidity(timeLineId) : dataList[curItemId].middle.hum,
    temperature:
      timeLineId !== null ? Hourly.getMaxTemp(timeLineId) : dataList[curItemId].middle.temp,
    windSpeed:
      timeLineId !== null ? Hourly.getWindSpeed(timeLineId) : dataList[curItemId].middle.wind,
    curTimeWeatherImg:
      timeLineId !== null ? Hourly.getCurImg(timeLineId) : dataList[curItemId].middle.img,
    pop: 
      timeLineId !== null ? Hourly.getPop(timeLineId) : dataList[curItemId].middle.pop,
  };

  return (
    <>
      <div className="mam-header">
        <WeatherDayDisc dayDiscr={dayDiscr} />
      </div>
      <div className="mam-graf">
        <WeatherGrafic graficArray={graficArray} graficId={graficId} curItemId={curItemId} />
      </div>
    </>
  );
});

const WeatherCards: React.FC<IWeatherCardsProps> = React.memo((props: IWeatherCardsProps) => {
  const { dataList, handleClick, curItemId = 0 } = props;

  const cardClick = (idx: number) => {
    if (handleClick) handleClick(idx);
  };

  return (
    <div className="card-list">
      {dataList.map((item, idx) => {
        const active = curItemId === idx ? 'active' : '';
        const [tempMin, tempMax] = item.temp;
        return (
          <div className={`card ${active}`} key={idx} onClick={() => cardClick(idx)}>
            <p className="card-day">{item.day.slice(0, 3)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${item.img}@2x.png`}
              className="card-img"
              alt="weather-igm"
            />
            <p className="card-temp-max">
              {tempMax}&deg;
              <span className="card-temp-min">{`${tempMin}`}&deg;</span>
            </p>
          </div>
        );
      })}
    </div>
  );
});

const Loading: React.FC = props => (
  <div className="mbl-loading">
    <img src={loadingSpin} alt="loading" className="loading" />
    <p>Loading data...</p>
  </div>
);

const Main: React.FC<IMainProps> = React.memo((props: IMainProps) => {
  const { city, dataList, curItemId, time, loading, timeLineId } = props;
  const value = useContext(Mycontext);
  const urls = [
    '/weather-page',
    '/weather-page/monday/',
    '/weather-page/tuesday/',
    '/weather-page/wednesday/',
    '/weather-page/thursday/',
    '/weather-page/friday/',
    '/weather-page/saturday/',
    '/weather-page/sunday/',
  ];

  const [description, setDescription] = useState('');
  const defaultPage = dataList.length ? dataList[0].day.toLowerCase() : '';
  let timeString = time;
  if (timeLineId === null) {
    timeString = '';
  } else if (!(curItemId === 0 && timeLineId === 0) && !!value.timeLine) {
    timeString = value.timeLine[timeLineId];
  }

  useEffect(() => {
    if (!loading) {
      //-- set description of timeline id
      if (timeLineId !== null) {
        setDescription(Hourly.getDiscription(timeLineId));
      }
      //-- set description defalut if curItemId is empty
      else {
        setDescription(Hourly.getMiddleDescription(curItemId));
      }
    }
  }, [loading, curItemId, timeLineId, dataList]);

  return (
    <div className="main-app">
      {loading && <Loading />}
      {!loading && (
        <>
          <header className="ma-header">
            <p className="ma-header-city">{city}</p>
            <p className="ma-header-day">
              {dataList[curItemId].day}
              <span>{timeString}</span>
            </p>
            <p>{description}</p>
          </header>
          <div className="ma-main">
            <Switch>
              <Route
                exact
                path={urls}
                render={() => (
                  <WeatherForDay
                    dataList={dataList}
                    timeLineId={timeLineId}
                    curItemId={curItemId}
                  />
                )}
              />
              <Redirect to={`/weather-page/${defaultPage}`} />
            </Switch>
          </div>
          <div className="ma-time">
            <TimeLine
              timeLine={value.timeLine}
              timeClick={value.timeClick}
              timeLineId={timeLineId}
            />
          </div>
          <div className="ma-days">
            <WeatherCards
              dataList={dataList}
              curItemId={value.curItemId}
              handleClick={value.handleClick}
            />
          </div>
        </>
      )}
    </div>
  );
});

const TimeLine: React.FC<ITimeLineProps> = (props: ITimeLineProps) => {
  const { timeLine = [''], timeClick, timeLineId } = props;
  const len = timeLine.length - 1;
  let active = '';

  const hdlTimeClick = (id: number) => {
    if (timeClick) timeClick(id);
  };

  return (
    <>
      {timeLine.map((i, id: number) => {
        if (timeLineId !== null && len < timeLineId) active = len === id ? 'active' : '';
        else active = timeLineId === id ? 'active' : '';
        return (
          <div key={i} onClick={() => hdlTimeClick(id)} className={`mat-item ${active}`}>
            <span>{i}</span>
          </div>
        );
      })}
    </>
  );
};

function App(props: any) {
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState(dataInit);
  const [city, setCity] = useState('');
  const [curItemId, setCurItemId] = useState(0);
  const [timeLine, setTimeLine] = useState(['']);
  const [grafic, setGrafic] = useState(graficInit);
  const [timeLineId, setTimelineId] = useState<number | null>(0);
  const [graficId, setGraficId] = useState(0);

  const opt = { minute: '2-digit', hour: '2-digit', hour12: false };
  const opt1 = { hour: '2-digit', hour12: false };
  const currentTime = `${new Date().toLocaleTimeString('en-US', opt1)}:00`;
  const history = useHistory();

  const calculateTime = function (i: { dt_txt: string }) {
    return new Date(i.dt_txt).toLocaleString('en-US', opt);
  };

  const handleClick = (itemId: number, shiftRight: boolean = false) => {
    setCurItemId(itemId);
    const newTimeLine = dataList[itemId].hourly.map(calculateTime);
    setTimeLine(newTimeLine);

    setTimelineId(null);
    history.push(`/weather-page/${dataList[itemId].day.toLowerCase()}`);
  };

  const hdlClickGrafic = (itemId: number) => {
    const obj: IObj = { arr: [[0]], tshift: Weather.getShift() };
    if (!loading) {
      switch (itemId) {
        case 0:
          obj.arr = Weather.getTemperatures();
          break;
        case 1:
          obj.arr = Weather.getRain();
          break;
        case 2:
          obj.arr = Weather.getWind();
          break;
        default:
          obj.arr = Weather.getTemperatures();
      }
      setGrafic(obj);
      setGraficId(itemId);
    }
  };

  const timeClick = (id: number) => {
    const shift = Weather.getShift();
    if (id >= shift && shift > 0 && curItemId === 0) {
      const newTimeLine = dataList[1].hourly.map(calculateTime);
      setTimelineId(id - shift);
      setCurItemId(1);
      setTimeLine(newTimeLine);
      history.push(`/weather-page/${dataList[1].day.toLowerCase()}`);
    } else setTimelineId(id);
  };

  useEffect(() => {
    const API_KEY = '1851a6abb6807389fbf59c68a2d03926';
    const LANGUAGE = 'lang=en';
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=618426&APPID=${API_KEY}&${LANGUAGE}`;
    axios
      .get(url)
      .then((response: any) => {
        if (response.statusText === 'OK') {
          try {
            // --- initializng weather Class with some methods
            Weather.init(response.data);
            //-- uncomite this line for test data from file
            // Weather.init(initialData);
            // -- getting array of 5 elements by sequance with  date and weather
            // -- [{date:..., },{date + 1:..., },...]
            const weatherList: Array<IWeatherList> = Weather.getDateArray5().map(
              (item: IHourly) => {
                const obj: IWeatherList = {
                  // -- url of iamge
                  img: Weather.getIcon(),
                  // -- [min, max]
                  temp: Weather.getMinMaxTemp('C'),
                  // -- January, 21 / 2020
                  // date: Weather.getCurDateTime('DMY'),
                  // -- Monday, Tuesday, Wednesday ...
                  day: Weather.getDayOfWeek(),
                  // timesLine: weather.getTimeList(),
                  // -- ["00:00","03:00","06:00"...]
                  hourly: Weather.getWeatherHourly(item.dt_txt),
                  // -- get middle item of hourly array
                  middle: Weather.getMiddle(item.dt_txt),
                };
                // -- jump to the next date in list
                Weather.nextDate();
                return obj;
              },
            );
            let defaultDay = 0;
            // -- getting list of days [Monday, Tuesday, Wednesday ...] from dtatList array
            const days = weatherList.map(i => i.day.toLowerCase());
            // -- getting path in format /weather-page/{ path }
            const path = history.location.pathname.toLowerCase().trim().slice(14);
            // -- seeking ID of day in days array
            // -- if day not found, then redirect to main page
            days.forEach((item, idx) => {
              if (path === item) defaultDay = idx;
            });
            // -- getting Tinmeline array from weather list by current ID
            const newTimeLine = weatherList[defaultDay].hourly.map(calculateTime);
            // -- set time line array like [00:00, 03:00, 06:00...]
            setTimeLine(newTimeLine);
            // -- set time line id to null if first day not active
            if (defaultDay > 0) setTimelineId(null);
            // -- set current index day in list of [Monday, Tuesday, Wednesday, ...]
            setCurItemId(defaultDay);
            // -- set list of 5 elements with full description on every day
            setDataList(weatherList);
            // -- set City name
            setCity(Weather.getCity());
            // -- set grafic array for all period and shift time on first day
            setGrafic({
              arr: Weather.getTemperatures(),
              tshift: Weather.getShift(),
            });
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } catch (err) {
            console.log('Sorry! Can`t load { data } from Api server! :', err.message);
          }
        }
      })
      .catch((err: any) => {
        console.log('Failed to load data from wether server Api...', err.message);
      });
  }, [history]);

  const contextValue: IContextProps = {
    graficArray: grafic,
    curItemId,
    handleClick,
    timeClick,
    timeLine,
    timeLineId,
    graficId,
    hdlClickGrafic,
  };

  return (
    <div>
      <Mycontext.Provider value={contextValue}>
        <Main
          loading={loading}
          city={city}
          time={currentTime}
          dataList={dataList}
          curItemId={curItemId}
          timeLineId={timeLineId}
        />
      </Mycontext.Provider>
    </div>
  );
}

export { ButtonsNav };

export default App;
