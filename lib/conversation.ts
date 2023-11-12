import { db } from "./db"

export const getOrCreateCOnversation = async (memberOneId: string, memberTwoId: string) => {

    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);
    if(!conversation) {

        conversation = await createNewConversation(memberOneId, memberTwoId);
    }
    return conversation;
}
const findConversation = async (memberOne: string, memberTwo: string) => {

    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    {
                        memberOneId: memberOne,
                        memberTwoId: memberTwo
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch (error) {
        return null;

    }


}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {

    try {
        return db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })

    } catch (error) {
        return null

    }
}