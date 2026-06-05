import { useCallback, useState } from "react"

interface UseRequestOptions<TData, TVariables> {
  requestFn: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
}

export const useRequest = <TData, TVariables>({
  requestFn,
  onSuccess,
  onError,
}: UseRequestOptions<TData, TVariables>) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const execute = useCallback(
    async (variables: TVariables) => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await requestFn(variables)

        setData(response)
        onSuccess?.(response)

        return response
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong"

        setError(message)
        onError?.(new Error(message))

        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [requestFn, onSuccess, onError]
  )

  return {
    execute,
    isLoading,
    error,
    data,
  }
}
