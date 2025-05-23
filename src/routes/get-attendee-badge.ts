import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/badge', {
            schema:{
                summary: "Get the badge of an Attendee",
                tags: ['attendees'],
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                response:{
                    200: z.object({
                        badge: z.object({
                            name: z.string().min(4),
                            email: z.string().email(),
                            eventTitle: z.string(),
                            eventDate: z.string().date(),
                            eventTime: z.string().time(),
                            checkInURL: z.string().url()
                        })
                    })
                }
            }
        }, async (request, reply) => {
        
            const { attendeeId } = request.params

            const attendee = await prisma.attendee.findUnique({
                select:{
                    name: true,
                    email: true,
                    event:{
                        select:{
                            title: true,
                            startDate: true,
                            startTime: true
                        }
                    }
                },
                where:{
                    id: attendeeId
                }
            })

            if (attendee === null){
                throw new BadRequest("Participante não encontrado!")
            }

            // Gera a URL para o usuário realizar o check-in
            const baseURL = `${request.protocol}://${request.hostname}`
            const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)
            
            return reply.send({ 
                badge:{
                    name: attendee.name,
                    email: attendee.email,
                    eventTitle: attendee.event.title,
                    eventDate: attendee.event.startDate,
                    eventTime: attendee.event.startTime,
                    checkInURL: checkInURL.toString()
                } 
            })

        })

}