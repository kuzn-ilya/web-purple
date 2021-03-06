import { getJson, deleteJson } from '../../utils/ajax';

export const REQUEST_POSTS = 'request_posts';

export function requestPosts() {
    return {
        type: REQUEST_POSTS,
    };
}

export const RECEIVE_POSTS = 'receive_posts';

export function receivePosts(posts) {
    return {
        type: RECEIVE_POSTS,
        payload: posts,
    };
}

export function fetchPosts() {
    return (dispatch) => {
        dispatch(requestPosts());
        return getJson('/api/posts')
            .then((postList) => dispatch(receivePosts(postList)));
    };
}

export const POST_REMOVED = 'post_removed';

export function postRemoved(post) {
    return {
        type: POST_REMOVED,
        payload: post,
    };
}

export function deletePost(id) {
    return dispatch => deleteJson(`/api/posts/${id}`)
        .then(removedPost => dispatch(postRemoved(removedPost)));
}
