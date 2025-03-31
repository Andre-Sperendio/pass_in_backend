// src/utils/generate-slug.ts
function generateSlug(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/--+/g, "-").replace(/^-+|-+$/g, "");
}

export {
  generateSlug
};
