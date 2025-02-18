import { Loading } from '@/components/misc/Loading'

export default function HistoryLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading chat history...
      </p>
    </Loading>
  )
} 