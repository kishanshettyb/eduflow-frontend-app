import IconListItems from '../cards/iconListItems';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Admins Component', () => {
  it('renders the component', () => {
    render(<IconListItems />);
  });
});
