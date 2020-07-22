import w from '../Components/Weather.js';

describe('Testing wether method .getSize()', () => {
  const data = { list: [] };
  // array from 24 items of date
  for (let i = 1; i < 25; i++) {
    data.list.push({ main: { temp: 10 }, dt_txt: new Date(`2020 8 ${i} 19:00:00`) });
  }
  // add mew date
  data.list.push({ main: { temp: 10 }, dt_txt: new Date('2020 9 26 12:00:00') });
  data.list.push({ main: { temp: 10 }, dt_txt: new Date('2020 9 26 15:00:00') });
  // add new date
  data.list.push({ main: { temp: 10 }, dt_txt: new Date('2020 5 28 12:00:00') });
  data.list.push({ main: { temp: 10 }, dt_txt: new Date('2020 5 28 15:00:00') });

  w().init(data);

  test('will return size of array  26', () => {
    expect(w.getSize()).toBe(26);
  });
});

describe('Testing weather method .getMinMaxTemp()', () => {
  const newDate = new Date('2020 8 7 19:00:00');
  const j = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
  const data = { list: [] };
  

  j.forEach(i => {
    data.list.push({ main: { temp: i + 273 }, dt_txt: new Date('2020 8 7 19:00:00') });
  });
  w().init(data);
  test('Will return Array [1, 10]', () => {
    expect(w.getMinMaxTemp()).toContain(1);
    expect(w.getMinMaxTemp()).toContain(10);
    expect(w.getMinMaxTemp()).not.toContain(null);
  });
});
