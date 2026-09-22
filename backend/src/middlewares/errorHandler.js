export function notFound(_request, response) {
  response.status(404).json({ message: 'Ruta no encontrada.' })
}

export function errorHandler(error, _request, response, _next) {
  console.error(error)
  const message = error.code === 'ER_NO_REFERENCED_ROW_2'
    ? 'La categoría o meta seleccionada ya no existe.'
    : error.code === 'ER_DATA_TOO_LONG'
      ? 'Uno de los textos excede la longitud permitida.'
      : 'No fue posible guardar la información. Revisa los datos e inténtalo de nuevo.'
  response.status(500).json({ message })
}
