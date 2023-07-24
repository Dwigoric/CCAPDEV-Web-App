import { reactive } from 'vue'
import { defineStore } from 'pinia'

import { API_URL } from '../constants'

const comments = reactive([])

export const useCommentsStore = defineStore('comments', () => {
    return {
        comments,
        async addComment(comment) {
            try {
                const { generatedId, error, message } = await fetch(
                    `${API_URL}/comments/${comment.postId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(comment)
                    }
                ).then((res) => res.json())

                if (error) {
                    console.error(message)
                    return
                }

                comment.id = generatedId
                comments.push(comment)
            } catch (err) {
                console.error(err)
            }
        },
        clearComments() {
            comments.splice(0, comments.length)
        }
    }
})
