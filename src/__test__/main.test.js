import { initialData, dateGenerator } from '../Interface/initialData';
import Weather from '../Components/Weather.ts';
import { NavButtons } from '../Components/App';

describe('Test Weather', () => {
  const data = {
    main: {
      city: 'Chishinau',
    },
    list: '',
  };
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const mon = dateNow.getMonth();
  const day = dateNow.getDate();

  describe('Test for App Component Weather instance of class Weather', () => {
    // test('should return 5 elements',()=>{
    // 	data.list = dateGenerator(25,6,2020,18,45);
    // 	Weather.init(data);
    // 	expect(Weather.getDateArray5()).toHaveLength(5);
    // });
    test('should return 5 elements from 7', () => {
      data.list = dateGenerator(25, 6, 2020, 18, 56);
      Weather.init(data);
      expect(Weather.getDateArray5()).toHaveLength(5);
    });

    test('should return 3  elements from 00:00', () => {
      data.list = dateGenerator(25, 6, 2020, 0, 8 * 3);
      Weather.init(data);
      expect(Weather.getDateArray5()).toHaveLength(3);
    });
    test('should return 4 elements from 12:00 ', () => {
      data.list = dateGenerator(25, 6, 2020, 0, 8 * 3);
      Weather.init(data);
      expect(Weather.getDateArray5()).toHaveLength(3);
    });
    test('should return 4 elements 8*3 + 1 ', () => {
      data.list = dateGenerator(25, 6, 2020, 12, 8 * 3 + 1);
      Weather.init(data);
      expect(Weather.getDateArray5()).toHaveLength(4);
    });
  });

  describe('Test shift time interval in first day', () => {
    test('Should return shift equal 4  from 12:00 in current day', () => {
      data.list = dateGenerator(day, mon, year, 12, 8 * 5);
      Weather.init(data);
      Weather.getWeatherHourly(new Date(year, mon, day, 12, 0));
      expect(Weather.getShift()).toBe(4);
    });
    test('Should return shift equal 0  from next day', () => {
      data.list = dateGenerator(day, mon, year, 12, 8 * 5);
      Weather.init(data);
      const anotherDate = new Date(year, mon, day + 1, 12, 0);
      Weather.getWeatherHourly(anotherDate);
      expect(Weather.getShift()).toBe(0);
    });
  });

  describe('Test instance Weather init method', () => {
    test('Test init should return false if no data', () => {
      data.list = '';
      const res = Weather.init(data);
      expect(res).toBeFalsy();
    });
    test('Test init should return true if data', () => {
      data.list = dateGenerator(18, 7, 2020, 12, 8 * 2);
      const res = Weather.init(data);
      expect(res).toBeTruthy();
    });
  });

  describe('Test instance Weather getDateArray5 method', () => {
    test('Sould return array with 5 elments from array with 8 elems', () => {
      //-- create 5 date elements
      data.list = dateGenerator(day, mon, year, 12, 8 * 8);
      Weather.init(data);
      expect(Weather.getDateArray5()).toHaveLength(5);
    });
    test('Sould return array with 4 elments from array with 4 elems', () => {
      //-- create 5 date elements
      data.list = dateGenerator(day, mon, year, 12, 8 * 3);
      Weather.init(data);
      expect(Weather.getDateArray5()).toHaveLength(4);
    });
  });

  describe('Test instance of Weather method getShift();', () => {
    //-- set hour 18:00
    let hour = 18;
    const count = 8 * 5; // 40
    test('Should return 2', () => {
      //-- generate sequense of date 40 elments
      data.list = dateGenerator(day, mon, year, hour, count);
      const newDate = new Date(year, mon, day, hour, 0);
      Weather.init(data);

      Weather.getWeatherHourly(newDate);
      expect(Weather.getShift()).toEqual(2);
    });

    test('Should return 0', () => {
      //-- set hour 00:00
      hour = 0;
      //-- generate sequense of date 40 elments
      data.list = dateGenerator(day, mon, year, hour, count);
      const newDate = new Date(year, mon, day, hour, 0);
      Weather.init(data);
      Weather.getWeatherHourly(newDate);
      expect(Weather.getShift()).toEqual(0);
    });
  });
});
