import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod';
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAtttendees } from "./routes/get-event-attendees";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./utils/error-handler";
import fastifyCors from "@fastify/cors";
import { deleteEvent } from "./routes/delete-event";
import { deleteAttendee } from "./routes/delete-attendee";
import { getAllEvents } from "./routes/get-all-events";

// Criação do app para elaboração das rotas
const app = fastify()

// Permite requisições à API
app.register(fastifyCors, {
    origin: '*'
})

// Documentação Swagger
app.register(fastifySwagger, {
    swagger:{
        consumes:['application/json'],
        produces:['application/json'],
        info:{
            title: "pass.in",
            description: "Documentação de Rotas da API para o backend da aplicação pass.in",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform
})

// Disponibiliza a documentação Swagger em http://localhost:8000/docs
app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

// Inicializar a Validação ZOD
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Rota para criação de eventos
app.register(createEvent)

// Rota para registro de participantes
app.register(registerForEvent)

// Rota para busca de informações de um evento
app.register(getEvent)

// Rota para buscar a Badge de um participante
app.register(getAttendeeBadge)

// Rota para realizar o check-in de um participante em um evento
app.register(checkIn)

// Rota para busca de participantes de um evento
app.register(getEventAtttendees)

// Rota para deletar um evento
app.register(deleteEvent)

// Rota para deletar um participante
app.register(deleteAttendee)

// Rota para buscar eventos pelo Slug
app.register(getAllEvents)

// Tratamento de Erros
app.setErrorHandler(errorHandler)

// Rodar o servidor
app.listen({ port:8000, host:'0.0.0.0' }).then(() => {
    console.log("Servidor HTTP rodando! http://localhost:8000/")
    console.log("Documentação de rotas disponível em: http://localhost:8000/docs")
})