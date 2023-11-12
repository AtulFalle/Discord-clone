'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import * as z from 'zod';
import { Form, FormControl, FormLabel, FormField, FormMessage, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import FileUpload from "../file-upload";
import axios from 'axios'
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from 'query-string';

const fromScema = z.object({
    fileUrl: z.string().min(1, {
        message: "Aattachment is required"
    })
})
export const MessageFileModal = () => {
    const router = useRouter();
    const {isOpen,onClose, type, data} = useModal();
    const {apiUrl, query} = data;

    const isModalOpen = isOpen && type === 'messageFile';


    const form = useForm({
        resolver: zodResolver(fromScema),
        defaultValues: {
            fileUrl: ''
        }
    });

    const handleClose = () => {

        onClose();
        form.reset();

    }

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof fromScema>) => {
        console.log(values);
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.post(url ,{...values, content: values.fileUrl });
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent
                className="bg-white text-back p-0 overflow-hidden"
            >
                <DialogHeader
                    className="pt-8 px-6">
                    <DialogTitle
                        className="text-center text-sxl font-bold text-black">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription
                        className="text-center text-zinc-500">
                        Send/attach a file as message
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}
                >
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <div
                            className="space-y-8 px-6">
                            <div
                                className="flex  items-center justify-center text-center">
                               <FormField 
                               control={form.control}
                               name="fileUrl"
                               render = {({field}) => (
                                <FormItem
                                >
                                    <FormControl>
                                        <FileUpload
                                        endpoint="messageFile"
                                        value={field.value}
                                        onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                               )}/>
                            </div>
                        </div>

                        <DialogFooter
                            className="bg-grey-100 px-6 py-4"
                        >
                            <Button
                                disabled={isLoading}
                                variant={"primary"}
                            >Send</Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}