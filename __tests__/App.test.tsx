/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/HomeScreen';

describe('HomeScreen', () => {
  it('muestra el saludo de bienvenida', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('Hola Expense Tracker')).toBeTruthy();
  });

  it('muestra el subtítulo', async () => {
    const { getByText } = await render(<HomeScreen />);
    expect(getByText('Tu dinero, bajo control.')).toBeTruthy();
  });
});
