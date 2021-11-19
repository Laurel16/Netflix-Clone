const fetch = require('node-fetch')

exports.handler = async function (event) {
  const body = JSON.parse(event.body)
  const genre = body.genre
  const pageState = body.pageState

  const url = process.env.REACT_APP_ASTRA_GRAPHQL_ENDPOINT
  const query = `
    query {
    movies_by_genre (
    value: {genre: ${JSON.stringify(genre)}},
    orderBy: [years_DESC],
    options: {pageSize: 6, pageState: ${JSON.stringify(pageState)}}
    ){
      values {
        years,
        title,
        duration,
        synopsis,
        thumbnail
      }
      pageState
    }
    }
  `
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "x-cassandra-token": process.env.REACT_APP_ASTRA_DB_APPLICATION_TOKEN
    },
    body: JSON.stringify({ query })
  })

  try {
    const responseBody = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody)
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    }
  }
}
