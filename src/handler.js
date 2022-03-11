/* eslint-disable quote-props */
const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  // eslint-disable-next-line no-prototype-builtins
  const nameProperty = request.payload.hasOwnProperty('name')

  if (!nameProperty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (pageCount >= readPage) {
    books.push(newBook)
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllNotesHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (name) {
    const arr = []
    for (let i = 0; i < books.length; i++) {
      if (books[i].name.toLowerCase().includes(name.toLowerCase())) {
        const { id, name, publisher } = books[i]
        arr.push({ id, name, publisher })
      }
    }

    return {
      status: 'success',
      data: {
        books: arr
      }
    }
  }

  if ((reading && Number(reading) === 0) || (reading && Number(reading) === 1)) {
    const arr = []
    for (let i = 0; i < books.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (books[i].reading == reading) {
        const { id, name, publisher } = books[i]
        arr.push({ id, name, publisher })
      }
    }

    return {
      status: 'success',
      data: {
        books: arr
      }
    }
  } else if ((reading && Number(reading) !== 0) && (reading && Number(reading) !== 1)) {
    const arr = []
    for (let i = 0; i < books.length; i++) {
      const { id, name, publisher } = books[i]
      arr.push({ id, name, publisher })
    }

    return {
      status: 'success',
      data: {
        books: arr
      }
    }
  }

  if ((finished && Number(finished) === 0) || (finished && Number(finished) === 1)) {
    const arr = []
    for (let i = 0; i < books.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (books[i].finished == finished) {
        const { id, name, publisher } = books[i]
        arr.push({ id, name, publisher })
      }
    }

    return {
      status: 'success',
      data: {
        books: arr
      }
    }
  } else if ((finished && Number(finished) !== 0) && (finished && Number(finished) !== 1)) {
    const arr = []
    for (let i = 0; i < books.length; i++) {
      const { id, name, publisher } = books[i]
      arr.push({ id, name, publisher })
    }

    return {
      status: 'success',
      data: {
        books: arr
      }
    }
  }

  if (books.length > 0 && !name && !reading && !finished) {
    const arr = []
    for (let i = 0; i < books.length; i++) {
      arr.push({ id: books[i].id, name: books[i].name, publisher: books[i].publisher })
    }

    return {
      status: 'success',
      data: {
        books: arr
      }
    }
  } else {
    return {
      status: 'success',
      data: {
        books
      }
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter((n) => n.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  // eslint-disable-next-line no-prototype-builtins
  const nameProperty = request.payload.hasOwnProperty('name')
  const { pageCount, readPage } = request.payload
  const biggerPageCount = pageCount >= readPage

  if (!nameProperty) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (!biggerPageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else if (nameProperty && biggerPageCount) {
    const { id } = request.params

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    } = request.payload

    const updatedAt = new Date().toISOString()

    const index = books.findIndex((note) => note.id === id)

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
      }

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllNotesHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
