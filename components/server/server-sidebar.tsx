import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from '@/components/server/server-header';
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
interface ServerSidebarProp {
    serverId: string
}

const iconMap = {
    [ChannelType.Text]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.Audio]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.Video]: <Video className="mr-2 h-4 w-4" />,
};

const roelIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}
const ServerSidebar = async ({
    serverId
}: ServerSidebarProp) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect('/');
    }
    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });
    if (!server) {
        return redirect('/')
    }

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.Text);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.Audio);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.Video);
    const members = server?.members.filter((member) => member.profileId !== profile.id)
    // const members = server?.members;

    const role = server.members.find(member => member.profileId == profile.id)?.role;



    return (
        <div
            className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5] ">
            <ServerHeader
                server={server}
                role={role} />
            <ScrollArea
                className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={
                        [{
                            label: "Text Channels",
                            type: "channel",
                            data: textChannels.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                        },
                        {
                            label: "Voice Channels",
                            type: "channel",
                            data: audioChannels.map((audio) => ({
                                id: audio.id,
                                name: audio.name,
                                icon: iconMap[audio.type]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "channel",
                            data: videoChannels.map((video) => ({
                                id: video.id,
                                name: video.name,
                                icon: iconMap[video.type]
                            }))
                        },
                        {
                            label: "Members",
                            type: "member",
                            data: members.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roelIconMap[member.role]
                            }))
                        }
                        ]
                    } />
                </div>
                <Separator
                    className="bg-zinc-200 dark:bg-zinc-700 roun my-2" />
                {!!textChannels?.length
                    && (
                        <div
                            className="mb-2">
                            <ServerSection
                                sectionType="chennels"
                                channelType={ChannelType.Text}
                                role={role}
                                label="Text Channels"
                            />
                            {
                                textChannels.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server} />
                                ))
                            }
                        </div>
                    )

                }

                {/* Audio channels */}
                {!!audioChannels?.length
                    && (
                        <div
                            className="mb-2">
                            <ServerSection
                                sectionType="chennels"
                                channelType={ChannelType.Audio}
                                role={role}
                                label="Audio Channels"
                            />
                            <div className="space-y-[2px]">

                                {
                                    audioChannels.map((channel) => (


                                        <ServerChannel
                                            key={channel.id}
                                            channel={channel}
                                            role={role}
                                            server={server} />
                                    ))
                                }
                            </div>

                        </div>
                    )

                }
                {/* Video channels */}
                {!!videoChannels?.length
                    && (
                        <div
                            className="mb-2">
                            <ServerSection
                                sectionType="chennels"
                                channelType={ChannelType.Video}
                                role={role}
                                label="Video Channels"
                            />
                            <div className="space-y-[2px]">
                                {

                                    videoChannels.map((channel) => (
                                        <ServerChannel
                                            key={channel.id}
                                            channel={channel}
                                            role={role}
                                            server={server} />
                                    ))
                                }
                            </div>
                        </div>
                    )

                }
                {/* Members */}
                {!!members?.length
                    && (
                        <div
                            className="mb-2">
                            <ServerSection
                                sectionType="members"
                                role={role}
                                label="Members"
                            />
                            <div className="space-y-[2px]">
                                {
                                    members.map((member) => (
                                        <ServerMember
                                            key={member.id}
                                            server={server}
                                            member={member} />
                                    ))
                                }
                            </div>
                        </div>
                    )

                }
            </ScrollArea>
        </div>
    );
}

export default ServerSidebar;