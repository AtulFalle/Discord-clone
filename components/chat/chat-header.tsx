import { Hash, Menu } from "lucide-react";

import MobileToggle from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import SocketIndicator from "../socket-indicator";
  

interface ChatHeaderProp {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}
const ChatHeader = ({
    serverId, name, type, imageUrl
}: ChatHeaderProp) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId}/>
            {
                type === 'channel' && (
                    <Hash
                        className="w-5 h-5 text-zinc-500 
                    dark:text-zinc-400 mr-2" />
                )
            }
            {
                type === 'conversation' && (
                    <UserAvatar 
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                    src={imageUrl}/>
                )
            }
            <p
                className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div
            className="ml-auto flex items-center">
                <SocketIndicator />
            </div>

        </div>
    );
}

export default ChatHeader;