import { Loading } from '@/components/misc/Loading'

export default function ChatLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading AI chat...
      </p>
    </Loading>
  )
} 