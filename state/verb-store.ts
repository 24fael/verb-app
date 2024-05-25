import { create } from 'zustand'

// Initializes types for getters and setters
interface VerbState {
    completedTasksOnly: boolean,
    setCompletedTasksOnly: (completedTasksOnly: boolean) => void,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void
}

// Initializes the store along with inital value for the getters and business logic for the setters
export const useVerbStore = create<VerbState>()((set) => ({
    completedTasksOnly: false,
    setCompletedTasksOnly: (completedTasksOnly: boolean) => set({ completedTasksOnly }),
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading })
}))