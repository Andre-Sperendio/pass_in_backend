export function generateSlug(texto: string): string {
    return texto
        .normalize('NFD') // Decompõe letras de acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
        .toLowerCase() // Converte para minúsculas
        .trim() // Remove espaços no começo e no final
        .replace(/[^a-z0-9-]+/g, '-') // Substitui caracteres não alfanuméricos por "-"
        .replace(/--+/g, '-') // Substitui múltiplos hífens por um único
        .replace(/^-+|-+$/g, ''); // Remove hífens no começo ou no final
}
