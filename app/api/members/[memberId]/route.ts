import { currentProfile } from "@/lib/current-profile"
import  db from "@/lib/db";
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {

    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
        const serverId = searchParams.get("serverId");


        if (!profile) {
            return new NextResponse("unAuthorize", { status: 401 })

        }
        if (!serverId) {
            return new NextResponse("missing server id", { status: 400 })
        }
        if (!params.memberId) {
            return new NextResponse("missing member id", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile?.id
            },
          data: {
            members: {
                deleteMany: {
                    id: params.memberId,
                    profileId: {
                        not: profile?.id
                    }
                }

            },
            
          },
          include: {
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
          }
        });
        return NextResponse.json(server);

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal server error", { status: 500 })

    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {

    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
        const serverId = searchParams.get("serverId");


        if (!currentProfile) {
            return new NextResponse("unAuthorize", { status: 401 })

        }
        if (!serverId) {
            return new NextResponse("missing server id", { status: 400 })
        }
        if (!params.memberId) {
            return new NextResponse("missing member id", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile?.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile?.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });
        return NextResponse.json(server);

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal server error", { status: 500 })

    }
}