import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"
import { isLateByDatetime } from "../utils/is-late-by-datetime"

export async function createEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/events", {
            schema: {
                summary: "Create an Event",
                tags: ['events'],
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),
                    startDate: z.string().date(),
                    startTime: z.string().time()
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid()
                    })
                }
            }
        }, async (request, reply) => {
            
            const data = request.body

            const isDuplicateSlug = await prisma.event.findUnique({
                where: {
                    slug: generateSlug(data.title)
                }
            })
            if (isDuplicateSlug) {
                throw new BadRequest("Já existe um evento com este título!")
            }

            if (isLateByDatetime(data.startDate, data.startTime)){
                throw new BadRequest("Não pode criar um evento com data de início antes da data atual!")
            }
            
            const event = await prisma.event.create({
                data:{
                    title: data.title,
                    details: data.details,
                    maximumAttendees: data.maximumAttendees,
                    slug: generateSlug(data.title),
                    startDate: data.startDate,
                    startTime: data.startTime
                }
            })

            return reply.status(201).send({ 
                eventId: event.id
            }) 
        })
}

