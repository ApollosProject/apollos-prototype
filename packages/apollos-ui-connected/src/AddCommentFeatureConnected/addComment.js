import { gql } from '@apollo/client';

export default gql`
  mutation addComment(
    $text: String!
    $parentId: ID!
    $visibility: CommentVisibility
  ) {
    addComment(text: $text, parentId: $parentId, visibility: $visibility) {
      id
      text
      person {
        id
        nickName
        photo {
          uri
        }
        campus {
          id
          name
        }
      }
    }
  }
`;
