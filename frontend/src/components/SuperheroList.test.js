import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SuperheroProvider } from '../context/SuperheroContext';
import SuperheroList from './SuperheroList';

// Mock the context
jest.mock('../context/SuperheroContext', () => ({
  useSuperhero: () => ({
    getSuperheroes: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          nickname: 'Superman',
          image: { id: 1, path: '/uploads/image1.jpg' },
        },
      ],
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    }),
    deleteSuperhero: jest.fn().mockResolvedValue({}),
    getImageUrl: jest.fn((id, image) => `http://localhost:3001${image.path}`),
    loading: false,
    error: null,
  }),
  SuperheroProvider: ({ children }) => <>{children}</>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <SuperheroProvider>
        {component}
      </SuperheroProvider>
    </BrowserRouter>
  );
};

describe('SuperheroList', () => {
  it('renders superhero list', async () => {
    renderWithRouter(<SuperheroList />);
    
    await waitFor(() => {
      expect(screen.getByText('Superman')).toBeInTheDocument();
    });
  });

  it('renders add button', () => {
    renderWithRouter(<SuperheroList />);
    expect(screen.getByText('Додати супергероя')).toBeInTheDocument();
  });
});
