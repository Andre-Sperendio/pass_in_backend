import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance){

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema:{
                summary: "Check-in an Attendee on an Event",
                tags: ['check-ins'],
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                response:{
                    201: z.null()
                }
            }
        }, async (request, reply) =>{

            const { attendeeId } = request.params

            const attendee = await prisma.attendee.findUnique({
                where:{
                    id: attendeeId
                }
            })
            if (attendee === null){
                throw new BadRequest("Participante não encontrado!")
            }
            
            const isAlreadyCheckedIn = await prisma.checkIn.findUnique({
                where:{
                    attendeeId
                }
            })
            if(isAlreadyCheckedIn){
                throw new BadRequest("Este participante já fez check-in neste evento!")
            }

            await prisma.checkIn.create({
                data:{
                    attendeeId: attendeeId
                }
            })

            return reply.status(201).send() 

        })

}