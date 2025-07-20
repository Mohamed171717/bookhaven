
import React from 'react'


interface SingleBookProps {
  params: {id: string}
}

const BookDetails = async ({params}: SingleBookProps) => {

  const res = await fetch(`dfdsdfdfdfsdf/books/${params}`);
  if(!res.ok) {
    throw new Error("failed to load books");
  }
  const book = await res.json();

  return (
    <div>{book.title}</div>
  )
}

export default BookDetails;