import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/delete-attendee.ts
import { z } from "zod";
async function deleteAttendee(app) {
  app.withTypeProvider().delete("/attendees/:attendeeId", {
    schema: {
      summary: "Delete an Attendee",
      tags: ["attendees"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        204: z.undefined()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendee = await prisma.attendee.findUnique({
      where: {
        id: attendeeId
      }
    });
    if (attendee === null) {
      throw new BadRequest("Participante n\xE3o encontrado!");
    }
    await prisma.attendee.delete({
      where: {
        id: attendeeId
      }
    });
    return reply.status(204).send();
  });
}

export {
  deleteAttendee
};
