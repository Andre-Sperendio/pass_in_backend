import {
  updateEvent
} from "./chunk-55SN3AFD.mjs";
import {
  deleteAttendee
} from "./chunk-J7GGKJTE.mjs";
import {
  deleteEvent
} from "./chunk-Z6MWFE4L.mjs";
import {
  getAllEvents
} from "./chunk-BIN7THQF.mjs";
import {
  getAttendeeBadge
} from "./chunk-RGO7UZ5J.mjs";
import {
  getEventAtttendees
} from "./chunk-BNFW6ERK.mjs";
import {
  getEvent
} from "./chunk-OX4DX4AM.mjs";
import {
  registerForEvent
} from "./chunk-KZBLWXEH.mjs";
import {
  updateAttendee
} from "./chunk-DOIB4RZW.mjs";
import {
  errorHandler
} from "./chunk-EIQXFEAS.mjs";
import "./chunk-YRGFOKQX.mjs";
import {
  checkIn
} from "./chunk-XZ3XJ5AM.mjs";
import {
  createEvent
} from "./chunk-BORNKHIV.mjs";
import "./chunk-QJO26ERM.mjs";
import "./chunk-VPFMAY64.mjs";
import "./chunk-JV6GRE7Y.mjs";
import "./chunk-JRO4E4TH.mjs";

// src/server.ts
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Documenta\xE7\xE3o de Rotas da API para o backend da aplica\xE7\xE3o pass.in",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAtttendees);
app.register(deleteEvent);
app.register(deleteAttendee);
app.register(getAllEvents);
app.register(updateEvent);
app.register(updateAttendee);
app.setErrorHandler(errorHandler);
app.listen({ port: 8e3, host: "0.0.0.0" }).then(() => {
  console.log("Servidor HTTP rodando! http://localhost:8000/");
  console.log("Documenta\xE7\xE3o de rotas dispon\xEDvel em: http://localhost:8000/docs");
});
