"use client";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "./s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        //bigger than 10MB
        return toast.error(
          "File is too big! Please pick a file smaller than 10MB"
        );
      }

      if (file.type !== "application/pdf") {
        return toast.error("Please upload a PDF file");
      }

      try {
        setUploading(true);
        const data = await uploadFile(file);
        if (!data?.file_key || !data.file_name) {
          return toast.error("There was an error uploading your file");
        }

        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            //toast.success(data.message);
          },
          onError: (err) => {
            toast.error("There was an error uploading your file");
          },
        });
      } catch (error) {
        console.log(error);
        toast.error("There was an error uploading your file");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
    <div
      {...getRootProps({
        className:
          "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
      })}
    >
      <input {...getInputProps()} />
      {uploading || isPending  ? (
        <>
          {/* loading state */}
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="mt-2 text-sm text-slate-400">
            PDF is being uploaded...
          </p>
        </>
      ) : (
        <>
          <Inbox className="w-10 h-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Upload PDF</p>
        </>
      )}
    </div>
  </div>
  );
};

export default FileUpload;
