import { defineStore } from 'pinia'

export const useTempRegisterStore = defineStore('tempRegister', () => {
    const tempUsers = [
        {
            // test user
            username: 'user1',
            password: 'password1',
            image: `https://robohash.org/user1.png`
        }
    ]

    return {
        tempUsers
    }
})
