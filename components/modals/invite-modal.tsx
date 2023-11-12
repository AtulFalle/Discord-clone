'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,

    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog"

import * as z from 'zod';

import { useModal } from '@/hooks/use-modal-store';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setLoading] = useState(false);
    ;

    const isModalOpen = isOpen && type === 'invite';
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNew = async () => {
        try {
            setLoading(true)

            const response = await axios.patch(`/api/server/${server?.id}/invite-code`)
            onOpen('invite', { server: response.data });

        } catch (error) {
            console.log(error)
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
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div
                    className="p-6">
                    <Label
                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >Server invite link</Label>
                    <div
                        className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl} />
                        <Button size="icon"
                            disabled={isLoading}
                            onClick={onCopy}>
                            {
                                copied
                                    ? <Check className="w-4 h-4" />
                                    : <Copy className="w-4 h-4" />
                            }

                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4">
                        Generate a new link
                        <RefreshCw
                            className="w-4 h-4 ml-2" />
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}