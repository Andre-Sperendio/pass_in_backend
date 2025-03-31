import { FastifyInstance } from 'fastify'
import { BadRequest } from '../routes/_errors/bad-request'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    
    if (error.validation && error.code === 'FST_ERR_VALIDATION') {
        return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.validation.map((v: any) => ({
                path: v.instancePath,
                message: v.message
            }))
        });
    }

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Erro de validação',
            errors: error.flatten().fieldErrors
        });
    }
    
    if (error instanceof BadRequest){
        return reply.status(400).send({ message: error.message })
    }

    return reply.status(500).send({ message: "Erro de Servidor!" })
}