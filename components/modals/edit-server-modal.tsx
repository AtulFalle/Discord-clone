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
import { useModal} from '@/hooks/use-modal-store';

const fromScema = z.object({
    name: z.string().min(1, {
        message: "server name is required"
    }),

    imageUrl: z.string().min(1, {
        message: "server name is required"
    })
})
export const EditServerModal = () => {
    const {isOpen, onClose, type, data} = useModal();

    const {server} = data;
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(fromScema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    });

    useEffect(() => {

        if(server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);

        }
        
    },[server, form])
    const isModalOpen = isOpen && type === 'editServer';

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof fromScema>) => {
        console.log(values)
        try {
            await axios.patch(`/api/server/${server?.id}`, values);
            form.reset();
            router.refresh();
            window.location.reload();
            onClose();

        } catch (error) {
            console.log(error);
        }

    }
    const handleClose =() => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="bg-white text-back p-0 overflow-hidden"
            >
                <DialogHeader
                    className="pt-8 px-6">
                    <DialogTitle
                        className="text-center text-sxl font-bold text-black">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription
                        className="text-center text-zinc-500">
                        Give your server a Personality with a name and image
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
                               name="imageUrl"
                               render = {({field}) => (
                                <FormItem
                                >
                                    <FormControl>
                                        <FileUpload
                                        endpoint="serverImage"
                                        value={field.value}
                                        onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                               )}/>
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500
                                            dark: text-secondary/70">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 borer-0 focus-visible:ring-0 text-black
                                                focus-visible: ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}></FormField>
                        </div>

                        <DialogFooter
                            className="bg-grey-100 px-6 py-4"
                        >
                            <Button
                                disabled={isLoading}
                                variant={"primary"}
                            >Update</Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}