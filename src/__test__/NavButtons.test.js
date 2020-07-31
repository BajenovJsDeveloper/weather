import { shallow } from 'enzyme';
import { ButtonsNav } from '../Components/App.tsx';
import React from 'react';

describe('Test NavButtons', () => {
  let props = { hdlClickGrafic: () => {}, butonId: 0 };
  let btn = shallow(<ButtonsNav {...props} />);
  test('button name TEMP should be disabled by default', () => {
    expect(btn.find('[name="temp"]').prop('disabled')).toBeTruthy();
  });
  test('button name Rain should be enabled by default', () => {
    expect(btn.find('[name="rain"]').prop('disabled')).toBeFalsy();
  });
  test('button name Wind should be enabled by default', () => {
    expect(btn.find('[name="wind"]').prop('disabled')).toBeFalsy();
  });
});
describe('Active button Rain with buttonId equal to 1', () => {
  let props = { hdlClickGrafic: () => {}, butonId: 1 };
  let btn = shallow(<ButtonsNav {...props} />);
  test('button name TEMP should be enabled', () => {
    expect(btn.find('[name="temp"]').prop('disabled')).toBeFalsy();
  });
  test('button name Rain should be disabled', () => {
    expect(btn.find('[name="rain"]').prop('disabled')).toBeTruthy();
  });
  test('button name Wind should be enabled', () => {
    expect(btn.find('[name="wind"]').prop('disabled')).toBeFalsy();
  });
});

describe('Active button Wind with buttonId equal to 2', () => {
  let props = { hdlClickGrafic: () => {}, butonId: 2 };
  let btn = shallow(<ButtonsNav {...props} />);
  test('button name TEMP should be enabled', () => {
    expect(btn.find('[name="temp"]').prop('disabled')).toBeFalsy();
  });
  test('button name Rain should be disabled', () => {
    expect(btn.find('[name="rain"]').prop('disabled')).toBeFalsy();
  });
  test('button name Wind should be enabled', () => {
    expect(btn.find('[name="wind"]').prop('disabled')).toBeTruthy();
  });
});
