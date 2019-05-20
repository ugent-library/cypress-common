module.exports = {
  getParam (url, name) {
    url = url.slice(url.indexOf('?')) // Only use the query

    const values = new URLSearchParams(url).getAll(name)
    switch (values.length) {
      case 0:
        return null

      case 1:
        return values[0]

      default:
        return values
    }
  }
}
