import {
  validateCPF
} from "./chunk-YRGFOKQX.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/update-attendee.ts
import { z } from "zod";
async function updateAttendee(app) {
  app.withTypeProvider().patch("/attendees/:attendeeId", {
    schema: {
      summary: "Update an Attendee",
      tags: ["attendees"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      body: z.object({
        cpf: z.string().length(11).optional(),
        name: z.string().min(4).optional(),
        email: z.string().email().optional()
      }),
      response: {
        204: z.undefined()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const { cpf, name, email } = request.body;
    const attendee = await prisma.attendee.findUnique({
      where: {
        id: attendeeId
      }
    });
    if (attendee === null) {
      throw new BadRequest("Participante n\xE3o encontrado!");
    }
    const event = await prisma.event.findUnique({
      where: {
        id: attendee.eventId
      }
    });
    if (cpf && cpf !== attendee.cpf) {
      const isCPFValid = validateCPF(cpf);
      if (!isCPFValid) {
        throw new BadRequest("O CPF inserido \xE9 inv\xE1lido!");
      }
      const isDuplicateCPF = await prisma.attendee.findUnique({
        where: {
          eventId_cpf: {
            eventId: attendee.eventId,
            cpf
          }
        }
      });
      if (isDuplicateCPF) {
        throw new BadRequest("J\xE1 existe um participante cadastrado com este CPF!");
      }
    }
    if (email && email !== attendee.email) {
      const isDuplicateEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId: attendee.eventId,
            email
          }
        }
      });
      if (isDuplicateEmail) {
        throw new BadRequest("J\xE1 existe um participante cadastrado com este email!");
      }
    }
    const updatedAttendee = await prisma.attendee.update({
      where: {
        id: attendeeId
      },
      data: {
        cpf: cpf ?? attendee.cpf,
        name: name ?? attendee.name,
        email: email ?? attendee.email
      }
    });
    return reply.status(204).send();
  });
}

export {
  updateAttendee
};
