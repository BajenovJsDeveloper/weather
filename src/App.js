import React, { useState, useEffect } from 'react';
import './App.css';
import * as axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Weather from './Weather';
import loadingSpin from './Rolling-1s-200px.png';

const WeatherMap = ({ dataList, visible, handleClick }) =>
    (
      visible && (
      <div className="card-list">
        {dataList.map((item, idx) => (
          <div className="card" key={idx} id={idx} onClick={() => handleClick(idx)}>
            <p className="card-day">{item.day}</p>
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
    )
);

function App({ init }) {
  const weather = new Weather();
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState({});
  const [city, setCity] = useState('');

  const handleClick = (item) => {
    console.log(item);
  };

  useEffect(() => {
    const API_KEY = '1851a6abb6807389fbf59c68a2d03926';
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=618426&APPID=${API_KEY}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        if (response.statusText === 'OK') {
          if(!weather.init(response.data)) throw 'Data not initialized!';
          console.log(weather);
          const weatherArray = weather.getDateArray();
          setDataList(
            weatherArray.map((item) => {
              const obj = {
                img: weather.getIcon(),
                // city: weather.getCity(),
                temp: weather.getMinMaxTemp('C'),
                // date: weather.getCurDateTime('DMY'),
                day: weather.getDayOfWeek(),
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
          <h1>
            <em>Weather for 5 days</em>
          </h1>
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
                exact path="/weather-page"
                component={() => (
                  <WeatherMap key='weather' dataList={dataList} handleClick={handleClick} visible={!loading} />
                )}
              />
              <Route path='/' component={() => (<div>Hello</div>)}/>
              <Redirect to='/weather-page' />
            </Switch>
          </div>
        </article>
      </div>
  );
}

export default App;
