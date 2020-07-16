import React, { useState, useEffect } from 'react';
import './main.scss';
import * as axios from 'axios';
import {
  Route, Switch, Redirect, useHistory,
} from 'react-router-dom';
import { withRouter } from 'react-router';
import Weather from './Weather';
import Grafic from './Grafic';
import Hourly from './Hourly';

import loadingSpin from './Rolling-1s-200px.png';

const WeatherDayDisc = ( props ) => {
  const { wdDiscr } = props;
  return (
    <React.Fragment>
        <div>
          <img src={`https://openweathermap.org/img/wn/${wdDiscr.curTimeWeatherImg}@2x.png`} />
        </div>
        <div className="mamh-temp">
          <p>{`${wdDiscr.temperature}`}&deg;</p>
        </div>
        <div className="mamh-info">
          <p>{`preasure: ${wdDiscr.pressure} kPa`}</p>
          <p>{`humidity: ${wdDiscr.humidity}%`}</p>
          <p>{`wind speed: ${wdDiscr.windSpeed}m/s`}</p>
          <p>{`wind direction: ${wdDiscr.windDegrees}`}&deg;</p>
          <p></p>
        </div>
    </React.Fragment>
  );
}  

const WeatherGrafic = ({ currentDay, tempsArr }) => {
  const grafic = new Grafic(600, 130);

  useEffect(() => {
    grafic.drawTemps(tempsArr);
  }, [currentDay]);

  return (
    <React.Fragment>
      <canvas width="600px" height="130px" id="grafic"></canvas>
    </React.Fragment>
  );
};


// const Hourlylist = ({ listTable, currentItemId }) => {

//   const wrapper = listTable[currentItemId].hourly.map((w, idx) => {
//             const date = new Date(w.dt_txt);
//             const dayNow = new Date().getDate();
//             const time = `${date.getHours().toString().padStart(2, '0')}:
//                         ${date.getMinutes().toString().padStart(2, '0')}`;
//             let active = '';
//             const img = w.weather[0].icon;
//             const rain = w.rain ? w.rain['3h'] : null;
//             if (date.getDate() === dayNow && idx === 0) active = 'active';
//             return (
//               <div className={`hf-section ${active}`} key={time}>
//                 <p className="hf-time">{time}</p>
//                 <img className="hf-img" src={`https://openweathermap.org/img/wn/${img}@2x.png`} />
//                 {rain && <p className="hf-rain">{rain} mm</p>}
//               </div>
//             );
//         })
//   return (
//     <React.Fragment>
//       {wrapper}
//     </React.Fragment>
//   );
// }

const WeatherForDay = ({ listTable, currentItemId, timeId }) => {
  const hourly = new Hourly(listTable, currentItemId);
  const tempsArr = hourly.getTArray();
  let isVisible = !!listTable;
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
    date: curDate,
    // timeId: timeId,
  };
  console.log('render grafic...');
  return (isVisible &&
    <React.Fragment>
      <div className="mam-header">
        <WeatherDayDisc wdDiscr={wdDiscr}/>
      </div>
      <div className="mam-graf">
        <WeatherGrafic tempsArr={tempsArr} 
                       currentDay={currentItemId} />
      </div>
    </React.Fragment>
  );
};

const WeatherMap = ( props ) => {
  const { dataList, visible, handleClick, curItem } = props;
  console.log('rerender...', curItem)
  
  return (
    <div className="card-list">
      {dataList.map((item, idx) => {
        const active = (curItem === idx)? 'active':'';
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
              {item.temp[1]}&deg; 
              <span className="card-temp-min">
                {`  ${item.temp[0]}`}&deg;
              </span>
            </p>
          </div>
      )})}
    </div>
    );
};

function App({ init }) {
  const weather = new Weather();
  const opt = {minute:'2-digit',hour:'2-digit',hour12:false};
  const currentTime =  new Date().toLocaleString('en-US',opt);
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState(null);
  const [city, setCity] = useState('');
  const [curItemId, setCurItemId] = useState(0); 
  const [time, setTime] = useState(currentTime);
  const [timeLine, setTimeLine] = useState([]);
  const [timeLineId, setTimelineId] = useState(0);
  const history = useHistory();
  
  const wDay = ['monday','tuesday','wednesday','thuesday','friday','saturday','sunday'];

  const handleClick = (itemId) => {
    console.log(itemId);
    setCurItemId(itemId);
    const timeLine = dataList[itemId].hourly.map(i => {
            return new Date(i.dt_txt).toLocaleString('en-US',opt);
          });
    console.log("Found item:",itemId);
    setTimeLine(timeLine);

    history.push(`/weather-page/${dataList[itemId].day.toLowerCase()}`);
    console.log(history);
  };

  const timeClick = (id) => {
    console.log('time: ',timeLine[id]);
    setTimelineId(timeLine[id]);
  }

  useEffect(() => {
    const API_KEY = '1851a6abb6807389fbf59c68a2d03926';
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=618426&APPID=${API_KEY}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        if (response.statusText === 'OK') {
          if (!weather.init(response.data)) throw 'Data not initialized!';
          //-- getting array of 5 elements by sequance with  date and weather
          //-- [{date:..., },{date + 1:..., },...]
          const weatherList = weather.getDateArray().map((item) => {
              const obj = {
                img: weather.getIcon(), //-- url of iamge
                temp: weather.getMinMaxTemp('C'), //-- [10,25]
                date: weather.getCurDateTime('DMY'), //-- January, 21 / 2020
                day: weather.getDayOfWeek(), //-- Monday, Tuesday, Wednesday ... 
                // timesLine: weather.getTimeList(), //-- ["00:00","03:00","06:00"...]
                hourly: weather.getWeatherHourly(item.dt_txt),
              };
              weather.nextDate();
              return obj;
            });
          let id = 0;
          //-- getting list of days [Monday, Tuesday, Wednesday ...]
          const days = weatherList.map(i => i.day.toLowerCase());
          //-- /weather-page/{ path }
          let path = history.location.pathname.toLowerCase().trim().slice(14);
          //-- seeking ID of day in days array
          days.forEach((item,idx) =>{
            if(path === item) id = idx;
          });
          //-- getting Tinmeline array from weather list by current ID
          const timeLine = weatherList[id].hourly.map(i => {
            return new Date(i.dt_txt).toLocaleString('en-US',opt);
          });
          console.log("Found item:",id, days[id],days);
          setTimeLine(timeLine);
          setCurItemId(id);
          setDataList(weatherList);
          setCity(weather.getCity());
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log('Failed to load data rfom wether...', err);
      });
      console.log('Catched in effect:',history.location.pathname);
  }, [history]);

  return (
    <div>
        <Main loading={loading} city={city} time={time} dataList={dataList} timeClick={timeClick}
          curItemId={curItemId} timeLine={timeLine} history={history} handleClick={handleClick}
          timeLineId={timeLineId}
        
        />
    </div>
  );
}

function Main(props){
  const {city, 
         dataList,
         curItemId,
         time,
         history,
         handleClick,
         loading,
         timeClick,
         timeLine,
         timeLineId,
        } = props;
  const urls=['/weather-page',
                   '/weather-page/monday/',
                   '/weather-page/tuesday/',
                   '/weather-page/wednesday/',
                   '/weather-page/thursday/',
                   '/weather-page/friday/',
                   '/weather-page/saturday/',
                   '/weather-page/sunday/',
                   ];

  const defaultPage = (!!dataList)? dataList[0].day.toLowerCase() :'';
  // const timeLine = !!dataList? dataList[curItemId].hourly.map(i => {
   
  useEffect(()=>{
    console.log('Data list:', dataList);
  },[dataList]);

  return(
    <div className="main-app">
      {loading && (
              <div>
                <img  src={loadingSpin} 
                      alt="loading" 
                      className="loading" />
                <p>In progress...</p>
              </div>
      )}
      {!loading &&
        <React.Fragment>
          <header className="ma-header">
            <p className="ma-header-city">{city}</p>
            <p>
              {dataList[curItemId].day}
              <span> {time}</span>
            </p>
            <p>clear sky</p>
          </header>
          <div className="ma-main">
             <Switch>
              <Route
                exact path={urls}
                component={() => <WeatherForDay  listTable={dataList}
                                                 timeLineId={timeLineId}
                                                 currentItemId={curItemId} />
              }/>
              <Redirect to={`/weather-page/${defaultPage}`} />
            </Switch>
          </div>
          <div className='ma-time'>
            {timeLine.map((i,id) => (<div key={i} onClick={() => timeClick(id)} className='mat-item'><span>{i}</span></div>))}
          </div>
          <div className='ma-days'>
            <WeatherMap dataList={dataList} 
                        visible={false} 
                        curItem={curItemId}
                        handleClick={handleClick} />
          </div>
        </React.Fragment>
      }
    </div>  
    );
}


// const App = withRouter(Main);
export default App
