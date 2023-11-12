import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdProps {
    params: {
        serverId: string,
        channelId: string;
    }
}

const ChannelIDPage = async ({ params }: ChannelIdProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        }
    });

    if (!channel || !member) {
        redirect(`/`);
    }
    return (<div
        className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
            serverId={channel.serverId}
            name={channel.name}
            type="channel"
        />
        <ChatMessages
            member={member}
            name={channel.name}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}
            chatId={channel.id}
        />
        <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
                channelId: params.channelId,
                serverId: params.serverId

            }} />
    </div>);
}

export default ChannelIDPage;