import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import {useMutation} from '@apollo/react-hooks';
import {useForm} from '../utils/hooks';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

function PostForm() {
    const [errors, setErrors] = useState({});
    const {values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({query: FETCH_POSTS_QUERY, data: {getPosts: [result.data.createPost, ...data.getPosts]}});
            values.body = '';
        },
        onError(err){
            setErrors(err.graphQLErrors[0].message);
        },
    });

    function createPostCallback() {
        createPost();
    };

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input 
                        placeholder='Hi World!'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type='submit' color='instagram'>
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className='ui error message' style={{marginBottom: '20px'}}>
                    <ul className='list'>
                        <li>{Object.values(errors)}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body username createdAt
            likes{ id username createdAt}
            likeCount
            comments{ id body username createdAt}
            commentCount
        }
    }
`

export default PostForm;
