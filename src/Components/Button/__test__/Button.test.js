import { render, screen } from '@testing-library/react';
import {LoginBtn} from '../Button';

it('renders button with props passed as text', () => {
  render(<LoginBtn  text="Button Test"/>);
  const buttonElement = screen.getByText(/Button Test/i);
  expect(buttonElement).toBeInTheDocument();
});

it('disable button when props passed as disabled is true', () => {
  render(<LoginBtn  disabled={true} text="Button Test"/>);
  const buttonElement = screen.getByText(/Button Test/i);
  expect(buttonElement).toBeDisabled();
});

it('enable button when props passed as disabled is false', () => {
  render(<LoginBtn  disabled={false} text="Button Test"/>);
  const buttonElement = screen.getByText(/Button Test/i);
  expect(buttonElement).not.toBeDisabled();
});
