import IconsListItemBasic from '../cards/iconsListItemBasic';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Admins Component', () => {
  it('renders the component', () => {
    render(<IconsListItemBasic />);
  });

  it('renders the component with all props', () => {
    const props = {
      email: 'test@example.com',
      gst: 'GST123',
      phone: '1234567890',
      website: 'http://www.example.com',
      address: '123 Street, City',
      schoolcode: 'ABC123',
      username: 'user123'
    };
    const { getByText } = render(<IconsListItemBasic {...props} />);

    expect(getByText(props.email)).toBeInTheDocument();
    expect(getByText(props.gst)).toBeInTheDocument();
    expect(getByText(props.phone)).toBeInTheDocument();
    expect(getByText(props.website)).toBeInTheDocument();
    expect(getByText(props.address)).toBeInTheDocument();
    expect(getByText(props.schoolcode)).toBeInTheDocument();
    expect(getByText(props.username)).toBeInTheDocument();
  });

  it('renders the component without some props', () => {
    const props = {
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Street, City'
    };
    const { getByText, queryByText } = render(<IconsListItemBasic {...props} />);

    expect(getByText(props.email)).toBeInTheDocument();
    expect(getByText(props.phone)).toBeInTheDocument();
    expect(getByText(props.address)).toBeInTheDocument();
    expect(queryByText('Website:')).toBeNull();
    expect(queryByText('GST:')).toBeNull();
    expect(queryByText('Username:')).toBeNull();
    expect(queryByText('School Code:')).toBeNull();
  });

  it('renders the component without some props', () => {
    const props = {
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Street, City'
    };
    const { getByText, queryByText } = render(<IconsListItemBasic {...props} />);

    expect(getByText(props.email)).toBeInTheDocument();
    expect(getByText(props.phone)).toBeInTheDocument();
    expect(getByText(props.address)).toBeInTheDocument();
    expect(queryByText('GST:')).toBeNull();
    expect(queryByText('Username:')).toBeNull();
    expect(queryByText('School Code:')).toBeNull();
  });
});
