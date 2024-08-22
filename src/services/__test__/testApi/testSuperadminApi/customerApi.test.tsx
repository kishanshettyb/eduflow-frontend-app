import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getAllCustomers,
  getSingleCustomer,
  createCustomer,
  updateCustomer
} from '@/services/api/superadmin/customers/customerApi';
import { Customer } from '@/types/superadmin/customerTypes';

const mock = new MockAdapter(axios);

jest.mock('js-cookie', () => ({
  get: jest.fn(() => 'mock-token')
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

describe('Customer API', () => {
  const customerId = 1;

  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  // test('should get all customers successfully', async () => {
  //   const mockCustomers: Customer[] = [
  //     { id: 1, name: 'Customer 1' },
  //     { id: 2, name: 'Customer 2' }
  //   ];
  //   mock.onGet(`${baseURL}/customers`).reply(200, mockCustomers);

  //   const result = await axiosInstance.get<Customer[]>('customers');
  //   expect(result.data).toEqual(mockCustomers);
  // });

  test('should handle error when getting all customers', async () => {
    mock.onGet(`${baseURL}/customers`).reply(500);

    await expect(getAllCustomers()).rejects.toThrow();
  });

  // test('should get a single customer successfully', async () => {
  //   const mockCustomer: Customer = { id: customerId, name: 'Customer 1' };
  //   mock.onGet(`${baseURL}/customers/${customerId}`).reply(200, mockCustomer);

  //   const result = await getSingleCustomer(customerId);
  //   expect(result.data).toEqual(mockCustomer);
  // });

  test('should handle error when getting a single customer', async () => {
    mock.onGet(`${baseURL}/customers/${customerId}`).reply(500);

    await expect(getSingleCustomer(customerId)).rejects.toThrow();
  });

  // test('should create a new customer successfully', async () => {
  //   const mockCustomer: Customer = { id: 1, name: 'New Customer' };
  //   mock.onPost(`${baseURL}/customers`).reply(201, mockCustomer);

  //   await createCustomer(mockCustomer);

  //   // No need to assert for response since createCustomer does not return data
  //   expect(mock.history.post.length).toBe(1); // Verify that one POST request was made
  // });

  test('should handle error when creating a new customer', async () => {
    const mockCustomer: Customer = { id: 1, name: 'New Customer' };
    mock.onPost(`${baseURL}/customers`).reply(500);

    await expect(createCustomer(mockCustomer)).rejects.toThrow();
  });

  // test('should update a customer successfully', async () => {
  //   const mockCustomer: Customer = { id: customerId, name: 'Updated Customer' };
  //   mock.onPut(`${baseURL}/customers`).reply(200, mockCustomer);

  //   await updateCustomer(mockCustomer);

  //   // No need to assert for response since updateCustomer does not return data
  //   expect(mock.history.put.length).toBe(1); // Verify that one PUT request was made
  // });

  test('should handle error when updating a customer', async () => {
    const mockCustomer: Customer = { id: customerId, name: 'Updated Customer' };
    mock.onPut(`${baseURL}/customers`).reply(500);

    await expect(updateCustomer(mockCustomer)).rejects.toThrow();
  });
});
