import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";

// src/utils/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error.validation && error.code === "FST_ERR_VALIDATION") {
    return reply.status(400).send({
      message: "Erro de valida\xE7\xE3o",
      errors: error.validation.map((v) => ({
        path: v.instancePath,
        message: v.message
      }))
    });
  }
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de valida\xE7\xE3o",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({ message: "Erro de Servidor!" });
};

export {
  errorHandler
};
