import { reactive } from 'vue'
import { defineStore } from 'pinia'

import { API_URL } from '../constants'

const comments = reactive([])

export const useCommentsStore = defineStore('comments', () => {
    return {
        comments,
        async addComment(comment) {
            try {
                const { token } = window.$cookies.get('credentials')

                const {
                    comment: newComment,
                    error,
                    message
                } = await fetch(`${API_URL}/comments/${comment.postId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(comment)
                }).then((res) => res.json())

                if (error) {
                    console.error(message)
                    return
                }

                comments.push({
                    ...newComment,
                    date: Date.now()
                })
            } catch (err) {
                console.error(err)
            }
        },
        clearComments() {
            comments.splice(0, comments.length)
        }
    }
})
