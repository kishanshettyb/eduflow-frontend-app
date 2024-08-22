import { ImageDown, Trash } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

type FileUploadProps = {
  // eslint-disable-next-line no-unused-vars
  onFileSelected: (file: File | null) => void;
  initialFileUrl?: string | null;
  onRemoveFile: () => void;
  title: string;
  description: string;
};

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  onRemoveFile,
  initialFileUrl,
  title,
  description
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(initialFileUrl);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log('file', file.type);
        // Check file type
        if (!file.type.startsWith('image/')) {
          setErrorMessage('Invalid file type. Please select an image file.');
          return;
        }

        // Check file size (500 KB = 500 * 1024 bytes)
        if (file.size > 500 * 1024) {
          setErrorMessage('File size exceeds 500 KB. Please select a smaller file.');
          return;
        }

        setFilePreview(URL.createObjectURL(file));
        onFileSelected(file);
        setErrorMessage(null);
      }
    },
    maxFiles: 1
  });

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    if (filePreview) {
      const img = new Image();
      img.src = filePreview;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    } else {
      setImageDimensions(null);
    }
  }, [filePreview]);

  useEffect(() => {
    if (initialFileUrl) {
      setFilePreview(initialFileUrl);
    } else {
      setFilePreview(null);
    }
  }, [initialFileUrl]);

  return (
    <div className="flex flex-col gap-4 ">
      <div
        {...getRootProps()}
        className={`flex m-auto flex-col w-[150px] h-[150px] rounded-full items-center justify-center border-2 border-dashed p-2 transition duration-300 ease-in-out ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-800'
            : 'border-gray-300 bg-gray-50 dark:bg-slate-800'
        } hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-950`}
      >
        <input {...getInputProps()} />
        {!filePreview ? (
          <>
            <ImageDown className="w-10 h-10 text-slate-300" />
            <p className="text-slate-500 dark:text-slate-100 text-xs text-center mt-2">
              Upload profile photo
            </p>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={filePreview}
            alt="Preview"
            className="rounded-full w-[150px] h-[150px] object-cover"
            width={imageDimensions?.width}
            height={imageDimensions?.height}
          />
        )}
      </div>
      <p className="text-xs text-center text-gray-400 mb-0">
        Allowed: *.jpeg, *.jpg, *.png <br />
        Max size of 500KB
      </p>

      {errorMessage && <p className="text-xs text-red-500 mt-2 text-center">{errorMessage}</p>}
      {filePreview && (
        <Button
          className="w-1/2 m-auto"
          size="sm"
          variant="outline"
          onClick={() => {
            setFilePreview(null);
            onFileSelected(null);
            onRemoveFile();
          }}
        >
          <Trash className="w-4 h-4 me-3" />
          Remove Image
        </Button>
      )}
      <h2 className="mt-5 font-semibold">{title}</h2>
      <p className="text-slate-400 text-xs">{description}</p>
    </div>
  );
};

export default FileUpload;
