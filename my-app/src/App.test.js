import React from 'react';
import { render, screen } from '@testing-library/react';

// This code is the help the jest to help understand the swiper js code and modules.
// Mock Swiper components

jest.mock('swiper/react/swiper-react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper-mock">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide-mock">{children}</div>,
}));

// Mock Swiper modules
jest.mock('swiper/modules', () => ({
  Navigation: jest.fn(),
  Pagination: jest.fn(),
  Scrollbar: jest.fn(),
  A11y: jest.fn(),
}));

// Mock Swiper CSS
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/css/scrollbar', () => ({}));


import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
