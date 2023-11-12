'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,

    DialogFooter,

    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog"


import { useModal } from '@/hooks/use-modal-store';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from 'query-string';

export const DeleteChannelModal = () => {
    const router = useRouter();
    const { isOpen, onClose, type, data } = useModal();
    const { server, channel } = data;

    const [isLoading, setLoading] = useState(false);
    ;

    const isModalOpen = isOpen && type === 'deleteChannel';

    const onClick = async () => {
        try {
            setLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.delete(url);

            onClose();
            router.refresh();
            router.push(`/server/${server?.id}`)
        } catch (error) {
            console.log(error);


        } finally {
            setLoading(false)
        }
    }



    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-white text-back p-0 overflow-hidden"
            >
                <DialogHeader
                    className="pt-8 px-6">
                    <DialogTitle
                        className="text-center text-2xl font-bold text-black">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription
                        className="text-center text-zinc-500">
                        Are you sure <br />
                        <span
                            className="font-semibold text-indigo-500">#{channel?.name}</span> will be pemanantly deleted ?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter
                    className="bg-green-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            variant="outline"
                            onClick={onClose}
                        >Cancel</Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}>
                            Confirm</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}