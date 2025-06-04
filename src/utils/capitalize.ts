/**
 * Capitaliza a primeira letra de cada palavra em uma string,
 * convertendo o restante das letras para minúsculas.
 * Exemplo: "joHN doE" => "John Doe"
 */
export function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}