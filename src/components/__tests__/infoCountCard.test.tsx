import InfoCountCard from '@/components/cards/infoCountCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('ImageCard Component', () => {
  it('renders the component', () => {
    render(<InfoCountCard />);
  });

  it('renders the component with all required props', () => {
    render(
      <InfoCountCard
        title="Test Title"
        description="Test Description"
        imageUrl="/test.jpg"
        blueBg={false}
        greenBg={false}
      />
    );
  });

  it('renders the component with blue background', () => {
    render(
      <InfoCountCard
        title="Test Title"
        description="Test Description"
        imageUrl="/test.jpg"
        blueBg={true}
        greenBg={false}
      />
    );
  });

  it('renders the component with green background', () => {
    render(
      <InfoCountCard
        title="Test Title"
        description="Test Description"
        imageUrl="/test.jpg"
        blueBg={false}
        greenBg={true}
      />
    );
  });

  it('renders the component with yellow background (default)', () => {
    render(
      <InfoCountCard
        title="Test Title"
        description="Test Description"
        imageUrl="/test.jpg"
        blueBg={false}
        greenBg={false}
      />
    );
  });
  it('renders the title, description, and image', () => {
    const { getByText, getByAltText } = render(
      <InfoCountCard
        title="Test Title"
        description="Test Description"
        imageUrl="/test.jpg"
        blueBg={false}
        greenBg={false}
      />
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
    expect(getByAltText('Test Title')).toBeInTheDocument();
  });

  // Add similar tests for green and yellow backgrounds
});
