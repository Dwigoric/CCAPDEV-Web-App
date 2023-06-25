<script setup>
defineProps({
    reactions: {
        type: Number,
        required: false,
        default: 0
    }
})
</script>

<template>
    <div class="dooters">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path
                fill="#888888"
                d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20h-2Z"
            />
        </svg>
        <div class="count">{{ reactions }}</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="#888888" d="m12 20l-8-8l1.4-1.425l5.6 5.6V4h2v12.175l5.6-5.6L20 12l-8 8Z" />
        </svg>
    </div>
</template>

<style>
.dooters {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

.count {
    margin: auto;
}

svg path:hover {
    fill: orangered;
}
</style>
