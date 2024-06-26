import { currentProfile } from "@/lib/current-profile";
import  db from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
interface ServerIdProps {
    params: { serverId: string }
}
const ServerPage = async (
    { params }: ServerIdProps
) => {

    const profile = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            },

        },
        include: {
            channels: {
                where: {
                    name: 'general'
                }
            }
        }
    });
    const initialChannel = server?.channels[0];

    if(initialChannel?.name !== 'general') {
        return null;
    }
    return redirect(`/server/${server?.id}/channels/${initialChannel.id}`)
}

export default ServerPage;