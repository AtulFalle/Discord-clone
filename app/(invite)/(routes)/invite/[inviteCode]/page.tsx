import { currentProfile } from "@/lib/current-profile";
import  db from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic'
interface InviteCodeProps {
    params: {
        inviteCode: string
    }
}

const InviteCodePage = async( {
    params
}: InviteCodeProps) => {

    const profile =await currentProfile();
    if(!profile) {
        return redirectToSignIn({returnBackUrl: "/"});
    }
    if(!params.inviteCode) {
        redirect('/')
    }
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(existingServer) {
        return redirect(`/server/${existingServer.id}`);
    }
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    });
    if(server) {
        return redirect(`/server/${server.id}`);

    }

    return null
}
 
export default InviteCodePage;