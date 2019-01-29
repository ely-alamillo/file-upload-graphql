import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, Mutation } from 'react-apollo';
import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';

import gql from 'graphql-tag';

const uploadLink = createUploadLink({ uri: 'http://localhost:4000/graphql' });
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });
const cache = new InMemoryCache();

const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    addProfilePicture(picture: $file)
  }
`;

const handleChange = async (event, mutation) => {
  const {
    target: {
      validity,
      files: [file]
    }
  } = event;

  if (validity.valid) {
    console.log({ file, event: event.target });
    // Call graphql API
    const data = await mutation({
      mutation: UPLOAD_FILE,
      variables: { file },
      fetchPolicy: 'no-cache'
    });
    // Use uploadSingleFile response
    console.log({ data });
  }
};

const UploadFile = ({ onChange, ...rest }) => {
  return (
    <Mutation mutation={UPLOAD_FILE} fetchPolicy="no-cache">
      {(mutation, { loading }) => (
        <input
          type="file"
          required
          onChange={event => handleChange(event, mutation)}
        />
      )}
    </Mutation>
  );
};

// apollo client setup
const client = new ApolloClient({
  cache,
  link: ApolloLink.from([uploadLink, httpLink])
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <UploadFile />
  </ApolloProvider>,
  document.getElementById('root')
);
