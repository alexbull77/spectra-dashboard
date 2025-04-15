import { MutationCache, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onSuccess: (_data, _variables, __context, mutation) => {
            if (!mutation.options.mutationKey) return
            queryClient.invalidateQueries({
                queryKey: mutation.options.mutationKey,
                predicate: (query) => {
                    // do not invalidate queries with staleTime: Infinity
                    const defaultStaleTime = queryClient.getQueryDefaults(query.queryKey).staleTime ?? 0
                    const staleTimes = query.observers
                        .map((observer) => observer.options.staleTime)
                        .filter((staleTime) => staleTime !== undefined) as number[]

                    const staleTime =
                        query.getObserversCount() > 0 && !!staleTimes.length
                            ? Math.min(...staleTimes)
                            : defaultStaleTime

                    return staleTime !== Number.POSITIVE_INFINITY
                },
            })
        },
    }),
})
