import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function PATCH(
    req: Request,
    { params, body }: { params: { serverId: string }, body: { name: string, imageUrl: string} }
) {
    try {
        const profile = await currentProfile();
        const {name, imageUrl} = await req.json();
        if (!profile) {
            return new NextResponse("Internal error", { status: 401 })

        }
        if (!params.serverId) {
            return new NextResponse("Server id missing", { status: 400 })

        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                imageUrl: imageUrl,
                name
            }
        });
        return NextResponse.json(server);

    } catch (error) {
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Internal error", { status: 401 })

        }
        if (!params.serverId) {
            return new NextResponse("Server id missing", { status: 400 })

        }
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });
        return NextResponse.json(server);

    } catch (error) {
        return new NextResponse("Internal error", { status: 500 })
    }
}