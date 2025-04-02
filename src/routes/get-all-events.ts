import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAllEvents(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events', {
            schema:{
                summary: "Get all Events, query by Event Slug",
                tags: ['events'],
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullish().default('0').transform(Number)
                }),
                response:{
                    200: z.object({
                        events: z.array(
                            z.object({
                                id: z.string().uuid(),
                                title: z.string(),
                                slug: z.string(),
                                details: z.string().nullable(),
                                maximumAttendees: z.number().int().nullable(),
                                attendeesAmount: z.number().int(),
                            })
                        )
                    })
                }
            }
        }, async (request, reply) => {

            const { query, pageIndex } = request.query

            const events = await prisma.event.findMany({
                select:{
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximumAttendees: true,
                    _count:{
                        select:{
                            attendees: true
                        }
                    }
                },
                where: query ? {
                    slug:{
                        contains: query
                    }
                } : {},
                take: 10,
                skip: pageIndex * 10,
                orderBy: {
                    slug: 'asc'
                }
            })

            return reply.send({ 
                events: events.map(event => {
                    return {
                        id: event.id,
                        title: event.title,
                        slug: event.slug,
                        details: event.details,
                        maximumAttendees: event.maximumAttendees,
                        attendeesAmount: event._count.attendees
                    }
                })
            })
    
        })
}