import Comment from './Comment'
import Mirror from './Mirror'
import Post from './Post'

export default function FeedItem({ item }) {
  switch (item.__typename) {
    case 'Post':
      return <Post item={item} />
    case 'Comment':
      return <Comment item={item} />
    case 'Mirror':
      return <Mirror item={item} />
    default:
      return 'No comp :('
  }
}
