import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";
import { validateCPF } from "../utils/validate-cpf";

export async function updateAttendee(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .patch("/attendees/:attendeeId", {
            schema:{
                summary: "Update an Attendee",
                tags: ['attendees'],
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                body: z.object({
                    cpf: z.string().length(11).optional(),
                    name: z.string().min(4).optional(),
                    email: z.string().email().optional()
                }),
                response:{
                    204: z.undefined()
                }
            }
        }, async (request, reply) => {

            const { attendeeId } = request.params
            const { cpf, name, email } = request.body

            const attendee = await prisma.attendee.findUnique({
                where:{
                    id: attendeeId
                }
            })
            if (attendee === null){
                throw new BadRequest("Participante não encontrado!")
            }

            const event = await prisma.event.findUnique({
                where: {
                    id: attendee.eventId
                }
            })

            if (cpf && cpf !== attendee.cpf) {
                const isCPFValid = validateCPF(cpf)
                if (!isCPFValid){
                    throw new BadRequest("O CPF inserido é inválido!")
                }

                const isDuplicateCPF = await prisma.attendee.findUnique({
                    where: {
                        eventId_cpf: {
                            eventId: attendee.eventId,
                            cpf
                        }
                    }
                })
                if (isDuplicateCPF){
                    throw new BadRequest("Já existe um participante cadastrado com este CPF!")
                }
            }

            if (email && email !== attendee.email){    
                const isDuplicateEmail = await prisma.attendee.findUnique({
                    where: {
                        eventId_email: {
                            eventId: attendee.eventId,
                            email
                        }
                    }
                })
                if (isDuplicateEmail) {
                    throw new BadRequest("Já existe um participante cadastrado com este email!")
                }
            }

            const updatedAttendee = await prisma.attendee.update({
                where: { 
                    id: attendeeId 
                },
                data: {
                    cpf: cpf ?? attendee.cpf,
                    name: name ?? attendee.name,
                    email: email ?? attendee.email,
                }
            })

            return reply.status(204).send()

        })
}