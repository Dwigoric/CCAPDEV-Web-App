<script setup>
import { useLoggedInStore } from '../stores/loggedIn'
import { ref } from 'vue'

const login = useLoggedInStore()
const cDescription = ref('')
const cUsername = ref('')
const modName = ref(false)
const modDesc = ref(false)


function changeName(){
    modName.value = true
}

function saveName(){
    if(cUsername.value === '') return

    modName.value = false
    login.username = cUsername.value
}

function changeDesc(){
    modDesc.value = true
}

function saveDesc(){
    if(cDescription.value === '') return

    modDesc.value = false
    login.description = cDescription.value
}

</script>

<template>
    <div class="top_part">
        <div class="username-edit">
            <div class="label1">
                <h2>Change Username:</h2>
            </div>
            <p v-if="!modName" class="val">
                {{ val }}
            </p>
            <VTextField 
                label="New Username"
                placeholder="Example: username123"
                clearable
                hide-details="auto"
                v-model="cUsername"
                append-inner-icon="mdi-send"
                @click:append-inner="saveName"
        />
        </div>

        <div class="description-edit">
            <div class="label2">
                <h2>Change Description:</h2>
            </div>
            <p v-if="!modDesc" class="val">
                {{ val }}
            </p>
            <VTextField 
                label="New Description"
                placeholder="Express your thoughts here, whether it be a biography or achievements, or what. Be creative about it!"
                clearable
                hide-details="auto"
                v-model="cDescription"
                append-inner-icon="mdi-send"
                @click:append-inner="saveDesc"
            />
        </div>
        <VBtn
        to="/profile"
        class="button"
        >
            Go Back
        </VBtn>
    </div>
    
</template>

<style scoped>

.label1{
    font-size: 10px;
}

.username-edit{
    width: 95vw;
    
}

.label2{
    font-size: 10px;
}

.description-edit{
    width: 95vw;
    
}

.button {
    position: relative;
    font-family: var(--source-sans);
    font-size: 12px;
    font-weight: 500;
    color: var(--vt-c-black-soft);
    background-color: var(--color-dark-pink);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    top: 15px;
    left: 5px;
    height: 35px;
    width: 100px;
}

</style>