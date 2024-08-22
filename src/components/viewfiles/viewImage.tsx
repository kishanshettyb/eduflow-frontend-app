import React from 'react';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import Image from 'next/image';
export type HeadingProps = {
  schoolId: number;
  attachmentId: number;
  width: number;
  height: number;
  styles: string;
  alt: string;
};

export const ViewImage: React.FC<HeadingProps> = ({
  schoolId,
  attachmentId,
  width,
  height,
  styles,
  alt
}) => {
  const viewAttachment = useViewAttachment(schoolId, attachmentId);
  const blobUrl = viewAttachment.data;

  return <Image alt={alt} width={width} height={height} className={styles} src={blobUrl} />;
};

export const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
  const { data: attachmentUrl, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);
  return isLoading ? (
    <div>Loading...</div>
  ) : isSuccess ? (
    <Image
      width="20"
      height="20"
      src={attachmentUrl}
      alt={attachmentName}
      className="h-20 w-20 object-cover "
    />
  ) : (
    <div>No File</div>
  );
};

export const ViewAttachmentLogoComponent = ({ schoolId, attachmentId, attachmentName }) => {
  const { data: attachmentUrl, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);

  return isLoading ? (
    <div>Loading...</div>
  ) : isSuccess ? (
    <Image
      width="100"
      height="100"
      src={attachmentUrl}
      alt={attachmentName}
      className="h-[100px] w-[100px] object-cover rounded-full"
    />
  ) : (
    <div>No File</div>
  );
};

export const ViewAttachmentBannnerComponent = ({ schoolId, attachmentId, attachmentName }) => {
  const { data: attachmentUrl, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);

  return isLoading ? (
    <div>Loading...</div>
  ) : isSuccess ? (
    <Image
      width="1920"
      height="300"
      className="w-full h-[255px] object-cover"
      src={attachmentUrl}
      alt={attachmentName}
    />
  ) : (
    <div>No File</div>
  );
};
