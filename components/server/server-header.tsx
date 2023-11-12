'use client';

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles,
    role?: MemberRole
}
export const ServerHeader = ({
    server, role
}: ServerHeaderProps) => {

    const { onOpen } = useModal();
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = role === MemberRole.MODERATOR || isAdmin;
    return (
        <DropdownMenu >
            <DropdownMenuTrigger
                className="focus: outline-none" asChild>

                <button
                    className="w-full text-md font-semibold px-3 flex items-center justify-center  h-12
border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700
dark:hover:bg-zi/50 transition
">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 font-medium text-xs text-black
            dark:text-neutral-400 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('invite', { server })}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex ">
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen('editServer', { server })}
                        className="px-3 py-2 text-sm cursor-pointer flex">
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("members", { server })}
                        className="px-3 py-2 text-sm cursor-pointer flex">
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                    onClick={() => onOpen("createChannel", { server })}
                        className="px-3 py-2 text-sm cursor-pointer flex">
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("deleteServer", {server})}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer flex">
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("leaveServer", {server})}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer flex">
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}

