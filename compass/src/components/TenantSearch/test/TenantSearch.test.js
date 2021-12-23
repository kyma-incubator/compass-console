import React from 'react';
import TenantSearch from '../TenantSearch';
import { render, fireEvent, wait } from '@testing-library/react';

const mockedTenants = [
  {
    name: 'Tenant-1',
    id: 'id-1',
  },
  {
    name: 'Tenant-2',
    id: 'id-2',
  },
];

const mockedConfig = {
  compassUrl: 'http://compass/director/graphql',
};

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  linkManager: () => ({ navigate: mockNavigate }),
}));

jest.mock('react-shared', () => ({
  useMicrofrontendContext: () => ({ tenants: mockedTenants }),
  useConfig: () => ({ fromConfig: () => mockedConfig }),
}));

describe('TenantSearch', () => {
  it('Focuses search field on load', async () => {
    const { queryByRole } = render(<TenantSearch />);

    expect(queryByRole('search')).toHaveFocus();
  });

  it('Filters list by tenant name, case-insensitive', async () => {
    const { getByRole, queryByText } = render(<TenantSearch />);

    fireEvent.change(getByRole('search'), {
      target: { value: 'tenant-1' },
    });

    expect(queryByText(/id-1/)).toBeInTheDocument();
    expect(queryByText(/id-2/)).not.toBeInTheDocument();
  });

  it('Filters list by tenant id', async () => {
    const { getByRole, queryByText } = render(<TenantSearch />);

    fireEvent.change(getByRole('search'), {
      target: { value: 'id-2' },
    });

    await wait(() => {
      expect(queryByText(/Tenant-1/)).not.toBeInTheDocument();
      expect(queryByText(/Tenant-2/)).toBeInTheDocument();
    });
  });

  it('Filters not only full match', async () => {
    const { getByRole, queryByText } = render(<TenantSearch />);

    fireEvent.change(getByRole('search'), {
      target: { value: 'tenant' },
    });

    await wait(() => {
      expect(queryByText(/Tenant-1/)).toBeInTheDocument();
      expect(queryByText(/Tenant-2/)).toBeInTheDocument();
    });
  });

  it('Fires navigation event when user clicks tenant entry', async () => {
    const { getByText } = render(<TenantSearch />);

    fireEvent.click(getByText(/Tenant-1/));

    expect(mockNavigate).toHaveBeenCalled();
  });
});
