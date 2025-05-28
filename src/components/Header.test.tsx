// src/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom'; // Header might contain Links

describe('Header Component', () => {
  it('renders the main title or a key element', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    // Adjust the text to something that actually exists in your Header.tsx
    // This is just an example. You might need to check for an aria-label, a specific role, or a title.
    // For instance, if your Header has a title "Spiritual Growth App":
    // expect(screen.getByText(/Spiritual Growth App/i)).toBeInTheDocument();
    // Or if it has a navigation landmark:
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Standard role for header
  });
});
