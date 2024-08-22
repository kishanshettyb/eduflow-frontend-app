import BarChartExample from '../cards/dashboardBarChart';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('Admins Component', () => {
  it('renders the component', () => {
    render(<BarChartExample />);
  });
});
