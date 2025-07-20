
"use client"
import React from 'react'

interface ErrorPageProps {
  error: Error;
  reset(): () => void;
}

const ErrorPage = ({error, reset}: ErrorPageProps) => {
  return (
    <div>
      <div>Something went wrong</div>
      <h3>{error.message}</h3>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

export default ErrorPage