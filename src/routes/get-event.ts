import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema:{
                summary: "Get an Event",
                tags: ['events'],
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response:{
                    200: z.object({
                        event: z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            slug: z.string(),
                            details: z.string().nullable(),
                            maximumAttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int(),
                            startDate: z.string().date(),
                            startTime: z.string().time()
                        })
                    })
                }
            }
        }, async (request, reply) => {

            const { eventId } = request.params

            const event = await prisma.event.findUnique({
                select:{
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximumAttendees: true,
                    startDate: true,
                    startTime: true,
                    _count:{
                        select:{
                            attendees: true
                        }
                    }
                },
                where:{
                    id: eventId
                }
            })

            if (event === null){
                throw new BadRequest("Evento não encontrado!")
            }

            return reply.send({ 
                event:{
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    details: event.details,
                    maximumAttendees: event.maximumAttendees,
                    attendeesAmount: event._count.attendees,
                    startDate: event.startDate,
                    startTime: event.startTime
                } 
            })

        })
}