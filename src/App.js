import React, { useState, useEffect } from 'react';
import './App.css';
import * as axios from 'axios';
import {
  Route, Switch, Redirect, useHistory,
} from 'react-router-dom';
import Weather, { Grafic, Hourly } from './Weather';

import loadingSpin from './Rolling-1s-200px.png';

const WeatherDayDisc = ({ wdDiscr, date }) => (
  <React.Fragment>
    <p className="hh-day">
      {wdDiscr.weekDay}
      <span>{date}</span>
    </p>
    <p className="hh-disc">{wdDiscr.discription}</p>
    <div className="hh-main">
      <div>
        <img src={`https://openweathermap.org/img/wn/${wdDiscr.curTimeWeatherImg}@2x.png`} />
      </div>
      <div className="hh-temp">
        <p>{`${wdDiscr.temperature}`}&deg;</p>
      </div>
      <div className="hh-info">
        <p>{`preasure: ${wdDiscr.pressure} kPa`}</p>
        <p>{`humidity: ${wdDiscr.humidity}%`}</p>
        <p>{`wind speed: ${wdDiscr.windSpeed}m/s`}</p>
        <p>{`wind direction: ${wdDiscr.windDegrees}`}&deg;</p>
        <p></p>
      </div>
    </div>
  </React.Fragment>
);

const WeatherGrafic = ({ currentDay, tempsArr }) => {
  const grafic = new Grafic(600, 200);

  useEffect(() => {
    grafic.drawTemps(tempsArr);
  }, [currentDay]);

  return (
    <React.Fragment>
      <p className="canv-temp">Temperature &deg;C</p>
      <canvas width="600px" height="200px" id="grafic"></canvas>
    </React.Fragment>
  );
};

const WeatherHourly = ({ listTable, currentItemId }) => {
  const hourly = new Hourly(listTable, currentItemId);
  const tempsArr = hourly.getTArray();
  const isVisible = !!listTable;
  const curDate = isVisible ? listTable[currentItemId].date : '';
  const wdDiscr = {
    weekDay: hourly.getWeekDay(),
    pressure: hourly.getPpressure(),
    humidity: hourly.getHumidity(),
    temperature: hourly.getMaxTemp(),
    windSpeed: hourly.getWindSpeed(),
    windDegrees: hourly.getWindDir(),
    discription: hourly.getDiscription(),
    curTimeWeatherImg: hourly.getCurImg(),
  };

  return (
    <div className="container-hourly">
      <div className="h-header">
        <WeatherDayDisc wdDiscr={wdDiscr} date={curDate} />
      </div>
      <div className="h-side">
        <p>Temperature&deg;C</p>
      </div>
      <div className="h-main">
        <WeatherGrafic tempsArr={tempsArr} currentDay={currentItemId} />
      </div>
      <div className="h-footer">
        {isVisible
          && listTable[currentItemId].hourly.map((w, idx) => {
            const date = new Date(w.dt_txt);
            const dayNow = new Date().getDate();
            const time = `${date.getHours().toString().padStart(2, '0')}:
                        ${date.getMinutes().toString().padStart(2, '0')}`;
            let active = '';
            const img = w.weather[0].icon;
            const rain = w.rain ? w.rain['3h'] : null;
            if (date.getDate() === dayNow && idx === 0) active = 'active';
            return (
              <div className={`hf-section ${active}`} key={time}>
                <p className="hf-time">{time}</p>
                <img className="hf-img" src={`https://openweathermap.org/img/wn/${img}@2x.png`} />
                {rain && <p className="hf-rain">{rain} mm</p>}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const WeatherMap = ({ dataList, visible, handleClick }) => visible && (
    <div className="card-list">
      {dataList.map((item, idx) => (
        <div className="card" key={idx} id={idx} onClick={() => handleClick(idx)}>
          <p className="card-day">{item.day.slice(0, 3)}</p>
          <img
            src={`https://openweathermap.org/img/wn/${item.img}@2x.png`}
            className="card-img"
            alt="weather-igm"
          />
          <p className="card-temp-max">
            {item.temp[1]}&deg; - <span className="card-temp-min">{item.temp[0]}&deg;</span>
          </p>
        </div>
      ))}
    </div>
);

function App({ init }) {
  const weather = new Weather();
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState(null);
  const [city, setCity] = useState('');
  const [curItem, setCurItem] = useState(0);
  const hisory = useHistory();

  const handleClick = (item) => {
    console.log(item);
    setCurItem(item);
    hisory.push(`/weather-page/dayly/${item}`);
  };

  useEffect(() => {
    const API_KEY = '1851a6abb6807389fbf59c68a2d03926';
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=618426&APPID=${API_KEY}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        if (response.statusText === 'OK') {
          if (!weather.init(response.data)) throw 'Data not initialized!';
          console.log(weather);
          const weatherArray = weather.getDateArray();
          setDataList(
            weatherArray.map((item) => {
              const obj = {
                img: weather.getIcon(),
                temp: weather.getMinMaxTemp('C'),
                date: weather.getCurDateTime('DMY'),
                day: weather.getDayOfWeek(),
                hourly: weather.getWeatherHourly(item.dt_txt),
              };
              weather.nextDate();
              return obj;
            }),
          );
          setCity(weather.getCity());
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log('Failed to load data rfom wether...', err);
      });
  }, [init]);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather</h1>
      </header>
      <article>
        <div className="container">
          <p className="container-city">{city}</p>
          {loading && (
            <div>
              <img src={loadingSpin} alt="loading" className="loading" />
              <p>In progress...</p>
            </div>
          )}
          <Switch>
            <Route
              exact
              path="/weather-page"
              component={() => (
                <WeatherMap
                  key="weather"
                  dataList={dataList}
                  handleClick={handleClick}
                  visible={!loading}
                />
              )}
            />
            <Route
              path="/weather-page/dayly"
              component={() => !loading && <WeatherHourly listTable={dataList} currentItemId={curItem} />
              }
            />
          </Switch>
        </div>
      </article>
    </div>
  );
}

export default App;
