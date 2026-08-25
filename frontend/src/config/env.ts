/**
 * Unico punto de lectura de variables de entorno del frontend.
 * Vite solo expone al cliente las variables prefijadas con VITE_.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Revisa frontend/.env.example.`)
  }
  return value
}

export const env = {
  apiUrl: required('VITE_API_URL', import.meta.env.VITE_API_URL),
}
