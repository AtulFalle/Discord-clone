"use client"

import { UploadDropzone } from "@/lib/uploadThing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image"

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "serverImage" | "messageFile"
}
const fileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {

    const fileType = value?.split(".").pop();
    if(value && fileType !== "pdf") {
        return (
            <div
            className="relative h-20 w-20"
            >
            <Image fill
            src={value}
            alt="upload"
            className="rounded-full"/>
            <button
             onClick={() => onChange("")}
             className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
             type="button">
                <X 
                className="h-3 w-3"
                />
            </button>
            </div>
            
        )
    }

    if(value && fileType == 'pdf') {
        return (
            <div 
            className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="w-10 h-10 fill-indigo-200 stroke-in " />
                <a href={value} target="_blank" rel="noopener noreferer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                    {value}
                </a>
                <button
             onClick={() => onChange("")}
             className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
             type="button">
                <X 
                className="h-3 w-3"
                />
            </button>
            </div>
        )
    }
    return ( 
       <UploadDropzone 
       endpoint={endpoint}
       onClientUploadComplete = {(res) => {
        onChange(res?.[0].url)
       }}
       onUploadError={ (e) => {
        console.log(e)
       }}
       />
        );
}
 
export default fileUpload;