import CardHead from '../cards/cardHead';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('CardHead Component', () => {
  it('renders the component with provided props', () => {
    const mockProps = {
      title: 'Sample Title',
      description: 'Sample Description',
      image: '/sample-image.jpg',
      btnLink: '/sample-link',
      btnName: 'Sample Button'
    };

    const { getByText } = render(<CardHead {...mockProps} />);

    expect(getByText('Sample Title')).toBeInTheDocument();
    expect(getByText('Sample Description')).toBeInTheDocument();

    expect(getByText('Sample Button')).toBeInTheDocument();
  });
});
