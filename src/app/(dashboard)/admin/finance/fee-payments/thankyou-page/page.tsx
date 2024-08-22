'use client';
import React, { useEffect, useState } from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  useGetFeesPaymentDetailes,
  useGetPDFFeesPaymentDetailes
} from '@/services/queries/admin/feePayment';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ThankYouPage = () => {
  const search = useSearchParams();
  const { schoolId, academicYearId } = useSchoolContext();
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

  const feePaymentId = search?.get('feePaymentId') as string;
  const { data, isLoading, isError } = useGetFeesPaymentDetailes(schoolId, feePaymentId);

  const { data: pdfBlob, refetch: fetchPDF } = useGetPDFFeesPaymentDetailes(
    schoolId,
    feePaymentId,
    academicYearId,
    Number(enrollmentId)
  );

  useEffect(() => {
    if (data) {
      const currentEnrollmentId = data.data.enrollmentId;
      setEnrollmentId(currentEnrollmentId);
    }
  }, [data]);

  const handleDownloadPDF = async () => {
    try {
      await fetchPDF();
      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Receipt.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('PDF Blob is null.');
      }
    } catch (error) {
      console.error('PDF download failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading payment details.</div>;
  }

  const FeesPaymentDetailes = data.data;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Thank You for Your Payment</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p>
            <span className="font-bold">InvoiceId:</span> {FeesPaymentDetailes.invoiceId}
          </p>
          <p>
            <span className="font-bold">Payment Status:</span> {FeesPaymentDetailes.paymentStatus}
          </p>
          <p>
            <span className="font-bold">Payment Date:</span>{' '}
            {new Date(FeesPaymentDetailes.createdTime).toLocaleString()}
          </p>
          <p>
            <span className="font-bold">Paid Fee:</span> {FeesPaymentDetailes.paidFee}
          </p>
          <p>
            <span className="font-bold">Payment Type:</span> {FeesPaymentDetailes.paymentType}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <span className="font-bold">School Name:</span> {FeesPaymentDetailes.schoolName}
          </p>
          <p>
            <span className="font-bold">Student Name:</span> {FeesPaymentDetailes.studentName}
          </p>
          <p>
            <span className="font-bold">Standard:</span> {FeesPaymentDetailes.standard}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <span className="font-bold">Fee Components:</span>
          </p>
          <ul>
            {FeesPaymentDetailes.feePaymentDetails.map((detail) => (
              <li key={detail.feePaymentDetailsId}>
                <p>
                  <span className="font-bold">{detail.feeComponentDto.feeComponentName}:</span> Paid{' '}
                  {detail.paidFee}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <Button onClick={handleDownloadPDF}>Download Receipt as PDF</Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
