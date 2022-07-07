import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link as NavLink } from 'react-router-dom'
import { Pagination, PaginationItem, TextField, Stack, Link } from '@mui/material'

const BASE_URL = 'https://hn.algolia.com/api/v1/search?'

export function HomePage(props) {
  console.log(props)
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('react')
  const [page, setPage] = useState(parseInt(props.location.search?.split('=')[1] || 1))
  const [pageQty, setPageQty] = useState(0)

  useEffect(() => {
    axios.get(BASE_URL + `query=${query}&page=${page - 1}`).then(({ data }) => {
      console.log(data)
      setPosts(data.hits)
      setPageQty(data.nbPages)

      if (data.nbPages < page) {
        setPage(1)
        props.history.replace('/')
      }
    })
  }, [query, page, props.history])

  return (
    <>
      <TextField
        fullWidth
        label='query'
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <Stack spacing={2}>
        {!!pageQty && (
          <Pagination
            count={pageQty}
            page={page}
            onChange={(_, num) => setPage(num)}
            showFirstButton
            showLastButton
            sx={{ marginY: 3, marginX: 'auto' }}
            renderItem={item =>
              //prettier-ignore
              <PaginationItem
                component={NavLink}
                to={`/?page=${item.page}`}
                {...item} />
            }
          />
        )}

        {posts.map(post => (
          <Link key={post.objectID} href={post.url}>
            {post.title || post.story_title}
          </Link>
        ))}
      </Stack>
    </>
  )
}
