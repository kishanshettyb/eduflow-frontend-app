import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllFeeComponent,
  getFeeComponentbyID,
  createFeeComponent,
  updateFeeComponent,
  viewFeeComponent,
  deleteFeeComponent,
  getAllFeeStructure,
  getFeeStructurebyID,
  createFeeStructure,
  viewFeeStructure,
  deleteFeeStructure,
  getAllAssignedFeesPayment,
  getAllEnrollmentFeesPayment,
  createFeePayment,
  createFeeStructureMapping,
  createStudentFeeStructureMapping,
  getFeeStructureAllMapping,
  getFeesPaymentDetailes,
  getPDFPaymentDetailes,
  getAllPaymentHistory,
  getSingleStudentFeesPaymentDetailes,
  getEnrollmentIdStudentDetailes,
  getFeeStructures,
  getUpdateChequeDetailes,
  updateCheque,
  getEnrollmentbyID,
  updateOnlinePaymentDetails
} from '@/services/api/admin/fees/fee';
import { FeeComponent } from '@/types/admin/feecomponentTypes';
import { FeeStructure, FeesPayment } from '@/types/admin/feestuctureTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Fee API', () => {
  const schoolId = 1;
  const academicYearId = 1;
  const feeComponentId = 1;
  const feeStructureId = 1;
  const token = 'mock-token';

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('Fee Component APIs', () => {
    test('should handle error when fetching all fee components', async () => {
      mock.onGet(`fee-components/schools/${schoolId}/years/${academicYearId}`).reply(500);

      await expect(getAllFeeComponent(schoolId, academicYearId)).rejects.toThrow();
    });

    test('should handle error when fetching a specific fee component by ID', async () => {
      mock.onGet(`fee-components/schools/${schoolId}/feeComponents/${feeComponentId}`).reply(500);

      await expect(getFeeComponentbyID(schoolId, feeComponentId)).rejects.toThrow();
    });

    test('should handle error when creating a new fee component', async () => {
      const newFeeComponent: FeeComponent = { id: 1, name: 'New Fee Component' };
      mock.onPost('fee-components').reply(500);

      await expect(createFeeComponent(newFeeComponent)).rejects.toThrow();
    });

    test('should handle error when updating a fee component', async () => {
      const updatedFeeComponent: FeeComponent = {
        id: feeComponentId,
        name: 'Updated Fee Component'
      };
      mock.onPut('fee-components').reply(500);

      await expect(updateFeeComponent(updatedFeeComponent)).rejects.toThrow();
    });

    test('should handle error when viewing fee components', async () => {
      mock.onGet(`fee-components/schools/${schoolId}/years/${academicYearId}`).reply(500);

      await expect(viewFeeComponent(schoolId, academicYearId)).rejects.toThrow();
    });

    test('should handle error when deleting a fee component', async () => {
      mock
        .onDelete(`fee-components/schools/${schoolId}/feeComponents/${feeComponentId}`)
        .reply(500);

      await expect(deleteFeeComponent(schoolId, feeComponentId)).rejects.toThrow();
    });
  });

  // Test cases for Fee Structure APIs
  describe('Fee Structure APIs', () => {
    test('should handle error when fetching all fee structures', async () => {
      mock.onGet(`/fee-structures/schools/${schoolId}/years/${academicYearId}`).reply(500);

      await expect(getAllFeeStructure(schoolId, academicYearId)).rejects.toThrow();
    });

    test('should handle error when fetching a specific fee structure by ID', async () => {
      mock.onGet(`fee-structures/schools/${schoolId}/feeStructures/${feeStructureId}`).reply(500);

      await expect(getFeeStructurebyID(schoolId, feeStructureId)).rejects.toThrow();
    });

    test('should handle error when creating a new fee structure', async () => {
      const newFeeStructure: FeeStructure = { id: 1, name: 'New Fee Structure' };
      mock.onPost('fee-structures').reply(500);

      await expect(createFeeStructure(newFeeStructure)).rejects.toThrow();
    });

    test('should handle error when viewing fee structures', async () => {
      mock.onGet(`/fee-structures/schools/${schoolId}/years/${academicYearId}`).reply(500);

      await expect(viewFeeStructure(schoolId, academicYearId)).rejects.toThrow();
    });

    test('should handle error when deleting a fee structure', async () => {
      mock
        .onDelete(`fee-structures/delete/schools/${schoolId}/feeStructures/${feeStructureId}`)
        .reply(500);

      await expect(deleteFeeStructure(schoolId, feeStructureId)).rejects.toThrow();
    });
  });

  describe('Additional Fee APIs', () => {
    test('should handle error when fetching all assigned fees payments', async () => {
      const standardIds = 1;
      const sectionIds = 1;
      mock
        .onGet(`/fee-payments/students/${schoolId}/${academicYearId}/${standardIds}/${sectionIds}`)
        .reply(500);

      await expect(
        getAllAssignedFeesPayment(schoolId, academicYearId, standardIds, sectionIds)
      ).rejects.toThrow();
    });

    test('should handle error when fetching enrollment by ID', async () => {
      mock.onGet(`academic-years/schools/${schoolId}/years/${academicYearId}`).reply(500);

      await expect(getEnrollmentbyID(schoolId, academicYearId)).rejects.toThrow();
    });

    test('should handle error when fetching all enrollment fees payments', async () => {
      const enrollmentsIds = 1;
      mock
        .onGet(
          `/fee-structures/schools/${schoolId}/enrollments/${enrollmentsIds}/years/${academicYearId}`
        )
        .reply(500);

      await expect(
        getAllEnrollmentFeesPayment(schoolId, academicYearId, enrollmentsIds)
      ).rejects.toThrow();
    });

    test('should handle error when creating a new fee payment', async () => {
      const newFeePayment: FeesPayment = { id: 1, amount: 1000 };
      mock.onPost('fee-payments').reply(500);

      await expect(createFeePayment(newFeePayment)).rejects.toThrow();
    });

    test('should handle error when updating online payment details', async () => {
      const paymentDetails: FeesPayment = { id: 1, amount: 1000 };
      mock.onPut('fee-payments/payment-response').reply(500);

      await expect(updateOnlinePaymentDetails(paymentDetails)).rejects.toThrow();
    });

    test('should handle error when creating fee structure mapping', async () => {
      const mappingData = { standardIds: [1, 2], feeStructureId: 1 };
      mock.onPost('fee-structures/assignStandards').reply(500);

      await expect(createFeeStructureMapping(mappingData)).rejects.toThrow();
    });

    test('should handle error when creating student fee structure mapping', async () => {
      const mappingData = { studentIds: [1, 2], feeStructureId: 1 };
      mock.onPost('fee-structures/assignStudents').reply(500);

      await expect(createStudentFeeStructureMapping(mappingData)).rejects.toThrow();
    });

    test('should handle error when fetching fee structure all mappings', async () => {
      const feeStructureId = 1;
      mock
        .onGet(
          `fee-structures/schools/${schoolId}/years/${academicYearId}/feeStructures/${feeStructureId}`
        )
        .reply(500);

      await expect(
        getFeeStructureAllMapping(schoolId, academicYearId, feeStructureId)
      ).rejects.toThrow();
    });

    test('should handle error when fetching fees payment details', async () => {
      const feePaymentId = 1;
      mock.onGet(`fee-payments/schools/${schoolId}/feePayments/${feePaymentId}`).reply(500);

      await expect(getFeesPaymentDetailes(schoolId, feePaymentId)).rejects.toThrow();
    });

    test('should handle error when fetching PDF payment details', async () => {
      const feePaymentId = 1;
      const enrollmentId = 1;
      mock
        .onGet(
          `fee-payments/generate-pdf/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}/feePayments/${feePaymentId}`
        )
        .reply(500);

      await expect(
        getPDFPaymentDetailes(schoolId, feePaymentId, academicYearId, enrollmentId)
      ).rejects.toThrow();
    });

    test('should handle error when fetching all payment history', async () => {
      const payload = {};
      mock.onPost(`fee-payments/pagination-filter/schools/${schoolId}`).reply(500);

      await expect(getAllPaymentHistory(schoolId, payload)).rejects.toThrow();
    });

    test('should handle error when fetching single student fees payment details', async () => {
      const enrollmentId = 1;
      mock
        .onGet(
          `fee-payments/feePayment/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}`
        )
        .reply(500);

      await expect(
        getSingleStudentFeesPaymentDetailes(schoolId, academicYearId, enrollmentId)
      ).rejects.toThrow();
    });

    test('should handle error when fetching enrollment ID student details', async () => {
      const enrollmentId = 1;
      mock.onGet(`enrollments/schools/${schoolId}/enrollments/${enrollmentId}`).reply(500);

      await expect(getEnrollmentIdStudentDetailes(schoolId, enrollmentId)).rejects.toThrow();
    });

    test('should handle error when fetching fee structures', async () => {
      const enrollmentId = 1;
      mock
        .onGet(
          `fee-structures/schools/${schoolId}/enrollments/${enrollmentId}/years/${academicYearId}`
        )
        .reply(500);

      await expect(getFeeStructures(schoolId, enrollmentId, academicYearId)).rejects.toThrow();
    });

    test('should handle error when fetching update cheque details', async () => {
      const feePaymentId = 1;
      mock.onGet(`fee-payments/schools/${schoolId}/feePayments/${feePaymentId}`).reply(500);

      await expect(getUpdateChequeDetailes(schoolId, feePaymentId)).rejects.toThrow();
    });

    test('should handle error when updating cheque', async () => {
      const chequeDetails: FeesPayment = { id: 1, amount: 1000 };
      mock.onPut('cheque-details').reply(500);

      await expect(updateCheque(chequeDetails)).rejects.toThrow();
    });
  });
});
