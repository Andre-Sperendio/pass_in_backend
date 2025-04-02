import {
  getEvent
} from "./chunk-SP7YHMHN.mjs";
import {
  registerForEvent
} from "./chunk-6KRO2NCA.mjs";
import {
  errorHandler
} from "./chunk-EIQXFEAS.mjs";
import {
  checkIn
} from "./chunk-IPPLF7PP.mjs";
import {
  createEvent
} from "./chunk-7WYCFGKK.mjs";
import "./chunk-QJO26ERM.mjs";
import {
  deleteAttendee
} from "./chunk-ULPNIB2T.mjs";
import {
  deleteEvent
} from "./chunk-F6QALX2C.mjs";
import {
  getAttendeeBadge
} from "./chunk-SBJGFG6H.mjs";
import {
  getEventAtttendees
} from "./chunk-R2ERTXLV.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

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
app.setErrorHandler(errorHandler);
app.listen({ port: 8e3, host: "0.0.0.0" }).then(() => {
  console.log("Servidor HTTP rodando! http://localhost:8000/");
  console.log("Documenta\xE7\xE3o de rotas dispon\xEDvel em: http://localhost:8000/docs");
});
