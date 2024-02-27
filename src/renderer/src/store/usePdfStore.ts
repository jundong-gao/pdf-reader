import { defineStore } from 'pinia'

export const usePdfStore = defineStore('pdf', {
    state() {
        return {
            fileList: [],
            curFile: null
        }
    },
    actions: {
        addFile(file) {
            this.fileList.push(file)
        }
    },
    getters: {

    },
    persist: {
        storage: localStorage,
        key(id) {
            return id
        },
        // paths: []
    }
})