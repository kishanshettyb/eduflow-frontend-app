import { useEffect } from 'react';
import { Download } from 'lucide-react'; // Import the Download icon from lucide-react
import { useDownloadInvoices } from '@/services/queries/attachment/attachment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Button } from '../ui/button';

type DownloadProps = {
  fileName: string;
  feePaymentId: number;
};

const DownloadInvoiceFile = ({ fileName, feePaymentId }: DownloadProps) => {
  const { schoolId, academicYearId, enrollmentId } = useSchoolContext();

  const downloadAttachment = useDownloadInvoices(
    schoolId,
    academicYearId,
    enrollmentId,
    feePaymentId
  );

  useEffect(() => {
    if (downloadAttachment.isError) {
      console.error('Error downloading file:', downloadAttachment.error);
    }
  }, [downloadAttachment.isError]);

  const download = async () => {
    const url = downloadAttachment.data;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileNameNew = `${fileName}.pdf`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileNameNew;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <Button
      onClick={download}
      className="w-full flex items-center justify-center py-4 mt-3 text-center text-white border rounded-md cursor-pointer bg-slate-950"
    >
      <Download size={18} color="white" className="mr-2" />
      <span>Download Invoice</span>
    </Button>
  );
};

export default DownloadInvoiceFile;
