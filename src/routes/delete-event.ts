import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function deleteEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .delete('/events/:eventId', {
            schema:{
                summary: "Delete an Event",
                tags: ['events'],
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response:{
                    204: z.undefined()
                }
            }
        }, async (request, reply) => {
            
            const { eventId } = request.params

            const event = await prisma.event.findUnique({
                where:{
                    id: eventId
                }
            })
            if (event === null){
                throw new BadRequest("Evento não encontrado!")
            }

            await prisma.event.delete({
                where:{
                    id: eventId
                }
            })

            return reply.status(204).send()

        }) 
}