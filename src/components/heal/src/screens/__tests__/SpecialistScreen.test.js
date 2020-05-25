import React from 'react';
import { render } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import SpecialistScreen, { SpecialistItem } from '../SpecialistScreen';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

const specialities = [
  { name: 'General Surgery', code: 'generalsurgery' },
  { name: 'Dentist', code: 'dentist' },
  { name: 'Family Medicine', code: 'familymedicine' },
  { name: 'Counselling Psychology', code: 'counsellingpsych' },
];

const getSpecialities = jest.fn().mockResolvedValue({ data: specialities });

describe('SpecialistScreen', () => {
  test('should render correctly', async () => {
    debugger;
    const [screen] = render(<SpecialistScreen navigation={navigation} />, {
      initialState: { heal: { specialities } },
      api: { getSpecialities },
    });
    await flushMicrotasksQueue();
    const specialityItems = screen.getAllByType(SpecialistItem);
    expect(specialityItems.length).toEqual(4);
  });
});
