import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";
import { validateCPF } from "../utils/validate-cpf";

export async function registerForEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema:{
                summary: "Create a new Attendee for an Event",
                tags: ['attendees'],
                body: z.object({
                    cpf: z.string().length(11),
                    name: z.string().min(4),
                    email: z.string().email()
                }),
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response:{
                    201: z.object({
                        attendeeId: z.number()
                    })
                }
            }
        }, async (request, reply) => {
            
            const { eventId } = request.params
            const { cpf, name, email } = request.body

            const [event, amountOfAttendeesOnEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId
                    }
                }),

                prisma.attendee.count({
                    where: {
                        eventId
                    }
                })
            ])
            
            if (event === null){
                throw new BadRequest("Evento não encontrado!")
            }
            
            if(event?.maximumAttendees && amountOfAttendeesOnEvent >= event?.maximumAttendees){
                throw new BadRequest("Este evento já está lotado!")
            }

            const isCPFValid = validateCPF(cpf)
            if (!isCPFValid){
                throw new BadRequest("O CPF inserido é inválido!")
            }

            const [isDuplicateCPF, isDuplicateEmail] = await Promise.all([
                prisma.attendee.findUnique({
                    where: {
                        eventId_cpf: {
                            eventId,
                            cpf
                        }
                    }
                }),
                prisma.attendee.findUnique({
                    where: {
                        eventId_email: {
                            eventId,
                            email
                        }
                    }
                })
            ])
            
            if (isDuplicateCPF){
                throw new BadRequest("Já existe um participante cadastrado com este CPF!")
            }
            
            if (isDuplicateEmail) {
                throw new BadRequest("Já existe um participante cadastrado com este email!")
            }
            
            const attendee = await prisma.attendee.create({
                data:{
                    cpf,
                    name,
                    email,
                    eventId
                }
            })
        
            return reply.status(201).send({ 
                attendeeId: attendee.id
            }) 

        })
}