import { Loading } from '@/components/misc/Loading'

export default function DocumentsLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading documents...
      </p>
    </Loading>
  )
} 