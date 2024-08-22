import { FileText, Trash, ImageDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { isError } from 'util';

type FileUploadProps = {
  // eslint-disable-next-line no-unused-vars
  onFileSelected: (file: File | null) => void;
  initialFileUrl?: string | null;
  title: string;
  description: string;
  error?: { message: string } | null;
  attachmentName?: string;
};

const GeneralFileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  initialFileUrl,
  title,
  description,
  error,
  attachmentName
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(initialFileUrl);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Check file size (2 MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
          setErrorMessage('File size exceeds 2 MB. Please select a smaller file.');
          return;
        }

        setFilePreview(URL.createObjectURL(file));
        setFileName(file.name);
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
    if (initialFileUrl) {
      setFilePreview(initialFileUrl);
    }
    if (attachmentName) {
      setFileName(attachmentName); // Add this line
    }
  }, [initialFileUrl, attachmentName]); // Add attachmentName to the dependency array

  const renderPreview = () => {
    if (!filePreview) return null;

    if (fileName?.match(/\.(jpeg|jpg|png|gif)$/i)) {
      return (
        <img src={filePreview} alt="Preview" className="w-full h-32 object-contain rounded-md" />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-32 w-full bg-gray-100 dark:bg-slate-800 rounded-md p-2">
        <FileText className="w-10 h-10 text-slate-300" />
        <p className="text-slate-500 dark:text-slate-100 text-xs mt-2">{fileName}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div
        {...getRootProps()}
        className={`flex flex-col w-full h-32 rounded-md items-center justify-center border-2 border-dashed p-4 transition duration-300 ease-in-out ${
          isError && error
            ? 'border-red-500 bg-red-50 dark:bg-red-800'
            : isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-800'
              : 'border-gray-300 bg-gray-50 dark:bg-slate-700'
        } hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800`}
      >
        <input {...getInputProps()} />
        {!filePreview ? (
          <>
            <ImageDown className="w-10 h-10 text-slate-300" />
            <p className="text-slate-500 dark:text-slate-100 text-xs text-center mt-2">
              Drag & Drop or Click to Upload
            </p>
            <div>
              {attachmentName ? (
                <p>File: {attachmentName}</p>
              ) : (
                <p className="text-sm text-slate-700">No file uploaded yet</p>
              )}
            </div>
          </>
        ) : (
          renderPreview()
        )}
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-slate-400">
        Allowed: All file types <br />
        Max size of 2MB
      </p>

      {error && <p className="text-xs text-red-500 mt-2 text-center">{error.message}</p>}
      {errorMessage && <p className="text-xs text-red-500 mt-2 text-center">{errorMessage}</p>}
      {filePreview && (
        <Button
          className="w-full sm:w-1/2 m-auto mt-2"
          size="sm"
          variant="outline"
          onClick={() => {
            setFilePreview(null);
            setFileName(null);
            onFileSelected(null);
          }}
        >
          <Trash className="w-4 h-4 mr-2" />
          Remove File
        </Button>
      )}
      <h2 className="mt-5 font-semibold text-center">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-xs text-center">{description}</p>
    </div>
  );
};

export default GeneralFileUpload;
