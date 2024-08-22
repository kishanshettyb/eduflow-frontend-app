import ImageCard from '../cards/imageCard';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('ImageCard Component', () => {
  it('renders the component', () => {
    render(<ImageCard />);
  });

  it('renders the component with all required props', () => {
    render(
      <ImageCard
        title="Test Title"
        id={1}
        place="Test Place"
        bgImageSrc="/test.jpg"
        logoSrc="/logo.jpg"
        name="Test Name"
        email="test@example.com"
        phone="123-456-7890"
        uniqueCode="ABC123"
        cardLink="/test/"
      />
    );
  });
  it('renders the component with default background image if bgImageSrc is missing', () => {
    render(
      <ImageCard
        title="Test Title"
        id={1}
        place="Test Place"
        bgImageSrc=""
        logoSrc="/logo.jpg"
        name="Test Name"
        email="test@example.com"
        phone="123-456-7890"
        uniqueCode="ABC123"
        cardLink="/test/"
      />
    );
  });
});
