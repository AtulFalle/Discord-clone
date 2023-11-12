'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,

    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog"


import { useModal } from '@/hooks/use-modal-store';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import qs from "query-string";
import { useRouter } from "next/navigation";

interface Map {
    [key: string]: string | undefined | any
}

const rolIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck
        className="h-4 w-4 ml-2 text-indigo-500"></ShieldCheck>,
    "ADMIN": <ShieldAlert
        className="h-4 w-4 ml-2 text-rose-500"></ShieldAlert>
}
export const MembersModal = () => {
    const router = useRouter();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const [loadingId, setloadingId] = useState("");
    ;

    const isModalOpen = isOpen && type === 'members';

    const onRoleChange = async (memberId: string, role: MemberRole) => {

        try {
            setloadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id                }
            });
            const res = await axios.patch(url, {role});
            router.refresh();
            onOpen("members", {server: res.data})
            
        } catch (error) {
            console.log(error);
            
            
        } finally {
            setloadingId("")

        }
    }

    const onKick = async (memberId: string) => {

        try {
            setloadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id                }
            });
            const res = await axios.delete(url);
            router.refresh();
            onOpen("members", {server: res.data})
            
        } catch (error) {
            console.log(error);
            
            
        } finally {
            setloadingId("")

        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-white text-back "
            >
                <DialogHeader
                    className="pt-8 px-6">
                    <DialogTitle
                        className="text-center text-2xl font-bold text-black">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription

                        className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="mt-8 max-h-[420px] pr-6 text-black">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {rolIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>

                            {
                                server.profileId  !== member.profileId
                                && loadingId !== member.id && (
                                    <div
                                    className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className="h-4 w-4 text-zinc-500"></MoreVertical>
                                           <DropdownMenuContent
                                           side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger
                                                className="flex items-center">
                                                    <ShieldQuestion
                                                    className="h-4 w-4 mr-2"
                                                    />
                                                        <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem 
                                                        onClick={ () => onRoleChange(member.id, "GUEST")}>
                                                            <Shield
                                                            className="h-4 w-4 mr-2"
                                                            />
                                                            Guest
                                                            {member.role === 'GUEST' && (
                                                                <Check
                                                                className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                        onClick={ () => onRoleChange(member.id, "MODERATOR")}>
                                                            <Shield
                                                            className="h-4 w-4 mr-2"
                                                            />
                                                            Moderator
                                                            {member.role === 'MODERATOR' && (
                                                                <Check
                                                                className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                            onClick={ () => onKick(member.id)}
                                            className="flex items-center">
                                                    <Gavel
                                                className="h-4 w-4 mr-2"
                                                />
                                                Kick
                                            </DropdownMenuItem>
                                           </DropdownMenuContent>
                                            </DropdownMenuTrigger>
                                        </DropdownMenu>
                                    </div>

                                )
                            }
                            {
                                loadingId === member.id && (
                                    <Loader2
                                    className="animate-spin text-zinc-500 ml-autow-4 h-4" />
                                )
                            }
                        </div>
                    ))}
                </ScrollArea>



            </DialogContent>
        </Dialog>
    )
}
