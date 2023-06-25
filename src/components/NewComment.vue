<script setup>
    import { useCommentsStore } from '../stores/comments'

    //const newCommentBody = ref('')
    //const commentsStore = useCommentsStore()

</script>

<template>
    <div id="new-comment">
        <VTextField
            placeholder="Add a comment..."
            id="new-comment-body"
            variant="outlined"
            v-model="body"
            :no-resize="true"
            @keyup.enter=""
        />
    </div>
</template>  

<style>
    #new-comment {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-soft);
    padding: 1rem;
    border-top: 1px solid var(--color-background);
}

#new-comment-body {
    width: 100%;
    background-color: var(--color-background);
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--color-text);
    resize: none;
}
</style>
    