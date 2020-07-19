import React, { useState, useEffect } from 'react';
import './main.scss';
import * as axios from 'axios';
import {
  Route, Switch, Redirect, useHistory,
} from 'react-router-dom';
import Weather from './Weather';
import Grafic from './Grafic';
import Hourly from './Hourly';
import loadingSpin from './Rolling-1s-200px.png';
import Mycontext from './MyContext';

const WeatherDayDisc = (props) => {
  const { wdDiscr } = props;
  return (
    <React.Fragment>
      <div className="mam-img">
        <img
          alt="w-img"
          src={`https://openweathermap.org/img/wn/${wdDiscr.curTimeWeatherImg}@2x.png`}
        />
      </div>
      <div className="mamh-temp">
        <p>{`${wdDiscr.temperature}`}</p>
      </div>
      <small>&deg;C</small>
      <div className="mamh-info">
        <p>{`Chance of rain: ${wdDiscr.pop}%`}</p>
        <p>{`Humidity: ${wdDiscr.humidity}%`}</p>
        <p>{`Wind: ${wdDiscr.windSpeed}m/s`}</p>
        <button>Temperature</button>
        <button>Chance of rain</button>
        <button>Wind</button>
      </div>
    </React.Fragment>
  );
};

const WeatherGrafic = React.memo((props) => {
  const { temperaturesArr, curItemId } = props;

  const ref = React.createRef();

  useEffect(() => {
    Grafic.init(600, 130, ref.current);
    Grafic.drawTemps(temperaturesArr.arr);
  }, [temperaturesArr.arr]);

  useEffect(() => {
    Grafic.slide(curItemId, temperaturesArr.tshift);
  }, [curItemId, temperaturesArr.tshift]);

  return (
    <React.Fragment>
      <canvas width="3600px" height="130px" id="grafic" ref={ref}></canvas>
    </React.Fragment>
  );
});

const WeatherForDay = React.memo((props) => {
  const { dataList, curItemId, timeLineId } = props;

  Hourly.init(dataList, curItemId);
  const wdDiscr = {
    weekDay: Hourly.getWeekDay(),
    humidity: Hourly.getHumidity(timeLineId),
    temperature: Hourly.getMaxTemp(timeLineId),
    windSpeed: Hourly.getWindSpeed(timeLineId),
    curTimeWeatherImg: Hourly.getCurImg(timeLineId),
    rain: Hourly.getRain(timeLineId),
    pop: Hourly.getPop(timeLineId),
  };

  return (
      <React.Fragment>
        <div className="mam-header">
          <WeatherDayDisc wdDiscr={wdDiscr} />
        </div>
        <div className="mam-graf">
          <Mycontext.Consumer>
            {(value) => (
              <WeatherGrafic temperaturesArr={value.temperaturesArr} curItemId={curItemId} />
            )}
          </Mycontext.Consumer>
        </div>
      </React.Fragment>
  );
});

const WeatherCards = React.memo((props) => {
  const { dataList, handleClick, curItemId } = props;
  const MIN = 0;
  const MAX = 1;

  return (
    <div className="card-list">
      {dataList.map((item, idx) => {
        const active = curItemId === idx ? 'active' : '';
        return (
          <div className={`card ${active}`} 
            key={idx} 
            id={idx} 
            onClick={() => handleClick(idx)}>
            <p className="card-day">{item.day.slice(0, 3)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${item.img}@2x.png`}
              className="card-img"
              alt="weather-igm"
            />
            <p className="card-temp-max">
              {item.temp[MAX]}&deg;
              <span className="card-temp-min">{`${item.temp[MIN]}`}&deg;</span>
            </p>
          </div>
        );
      })}
    </div>
  );
});

const Loading = (props) => (
  <div className="mbl-loading">
    <img src={loadingSpin} alt="loading" className="loading" />
    <p>Loading data...</p>
  </div>
);

const Main = React.memo((props) => {
  const {
    city, dataList, curItemId, time, loading, timeLineId,
  } = props;
  // const textDescription = discription.slice(0, 1).toUpperCase().concat(text.slice(1));
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
  const defaultPage = dataList ? dataList[0].day.toLowerCase() : '';

  useEffect(() => {
    if (!loading) {
      let text = dataList[curItemId].hourly[timeLineId].weather[0].description;
      text = text.slice(0, 1).toUpperCase().concat(text.slice(1));
      setDescription(text);
    }
    // console.log('discriprtion...');
  }, [loading, curItemId, timeLineId, dataList]);

  return (
    <div className="main-app">
      {loading && <Loading />}
      {!loading && (
        <React.Fragment>
          <header className="ma-header">
            <p className="ma-header-city">{city}</p>
            <p className="ma-header-day">
              {dataList[curItemId].day}
              <span>{curItemId === 0 ? time : ''}</span>
            </p>
            <p>{description}</p>
          </header>
          <div className="ma-main">
            <Switch>
              <Route
                exact
                path={urls}
                render={() => (
                  <Mycontext.Consumer>
                    {(value) => (
                      <WeatherForDay
                        dataList={dataList}
                        tArr={value.temperaturesArr}
                        timeLineId={timeLineId}
                        curItemId={curItemId}
                      />
                    )}
                  </Mycontext.Consumer>
                )}
              />
              <Redirect to={`/weather-page/${defaultPage}`} />
            </Switch>
          </div>
          <div className="ma-time">
            <Mycontext.Consumer>
              {(value) => (
                <TimeLine
                  timeLine={value.timeLine}
                  timeClick={value.timeClick}
                  timeLineId={value.timeLineId}
                />
              )}
            </Mycontext.Consumer>
          </div>
          <div className="ma-days">
            <Mycontext.Consumer>
              {(value) => (
                <WeatherCards
                  dataList={dataList}
                  curItemId={curItemId}
                  handleClick={value.handleClick}
                />
              )}
            </Mycontext.Consumer>
          </div>
        </React.Fragment>
      )}
    </div>
  );
});

function App(props) {
  const opt = { minute: '2-digit', hour: '2-digit', hour12: false };
  const opt1 = { hour: '2-digit', hour12: false };
  const currentTime = `${new Date().toLocaleTimeString('en-US', opt1)}:00`;
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState(null);
  const [city, setCity] = useState('');
  const [curItemId, setCurItemId] = useState(0);
  const [timeLine, setTimeLine] = useState([]);
  const [tArr, setTarr] = useState({ arr: [], tshift: 0 });
  const [timeLineId, setTimelineId] = useState(0);
  const history = useHistory();

  const callbackTime = (i) => new Date(i.dt_txt).toLocaleString('en-US', opt);

  const handleClick = (itemId) => {
    setCurItemId(itemId);
    const newTimeLine = dataList[itemId].hourly.map(callbackTime);
    setTimeLine(newTimeLine);

    history.push(`/weather-page/${dataList[itemId].day.toLowerCase()}`);
  };

  const timeClick = (id) => {
    setTimelineId(id);
  };
  const contextValue = {
    temperaturesArr: tArr,
    curItemId,
    handleClick,
    timeClick,
    timeLine,
    timeLineId,
  };
  useEffect(() => {
    const API_KEY = '1851a6abb6807389fbf59c68a2d03926';
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=618426&APPID=${API_KEY}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        if (response.statusText === 'OK') {
          try {
            //--- initializng weather Class with some methods
            Weather.init(response.data);
            // -- getting array of 5 elements by sequance with  date and weather
            // -- [{date:..., },{date + 1:..., },...]
            const weatherList = Weather.getDateArray5().map((item) => {
              const obj = {
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
              };
              //-- jump to the next date in list
              Weather.nextDate();
              return obj;
            });
            let dayIdx = 0;
            const newTempsArr = response.data.list.map((i) => Math.round(i.main.temp - 273));
            // -- getting list of days [Monday, Tuesday, Wednesday ...] from dtatList array
            const days = weatherList.map((i) => i.day.toLowerCase());
            // -- getting path in format /weather-page/{ path }
            const path = history.location.pathname.toLowerCase().trim().slice(14);
            // -- seeking ID of day in days array
            days.forEach((item, idx) => {
              if (path === item) dayIdx = idx;
            });
            // -- getting Tinmeline array from weather list by current ID
            const newTimeLine = weatherList[dayIdx].hourly.map(callbackTime);
            // -- set time line array like [00:00, 03:00, 06:00...]
            setTimeLine(newTimeLine);
            // -- set current index day in list of [Monday, Tuesday, Wednesday, ...]
            setCurItemId(dayIdx);
            // -- set list of 5 elements with full description on every day
            setDataList(weatherList);
            // -- set City name
            setCity(Weather.getCity());
            // -- set temperatures array for all period and shift time on first day
            setTarr({
              arr: newTempsArr,
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
      .catch((err) => {
        console.log('Failed to load data from wether server Api...', err.message);
      });
  }, [history]);

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

const TimeLine = (props) => {
  const { timeLine, timeClick, timeLineId } = props;
  const len = timeLine.length - 1;
  let active = '';
  return (
    <React.Fragment>
      {timeLine.map((i, id) => { 
        if (len < timeLineId) active = len === id ? 'active' : '';
        else active = timeLineId === id ? 'active' : '';
        return (
          <div key={i} onClick={() => timeClick(id)} className={`mat-item ${active}`}>
            <span>{i}</span>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default App;
