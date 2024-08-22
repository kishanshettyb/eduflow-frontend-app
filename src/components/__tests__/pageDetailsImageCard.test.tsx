import PageDetailsImageCard from '@/components/cards/pageDetailsImageCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('ImageCard Component', () => {
  it('renders the component', () => {
    render(<PageDetailsImageCard />);
  });

  it('renders the component with all required props', () => {
    render(
      <PageDetailsImageCard
        title="Test Title"
        profileUrl="https://example.com/profile.jpg"
        email="test@example.com"
        phone="123-456-7890"
      />
    );
  });
  it('renders the component with default image if profileUrl is missing', () => {
    render(
      <PageDetailsImageCard title="Test Title" email="test@example.com" phone="123-456-7890" />
    );
  });

  it('renders the title, email, and phone number', () => {
    const { getByText } = render(
      <PageDetailsImageCard
        title="Test Title"
        profileUrl="https://example.com/profile.jpg"
        email="test@example.com"
        phone="123-456-7890"
      />
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('test@example.com')).toBeInTheDocument();
    expect(getByText('123-456-7890')).toBeInTheDocument();
  });
});
