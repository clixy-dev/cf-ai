import { Loading } from '@/components/misc/Loading'

export default function DashboardLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading dashboard...
      </p>
    </Loading>
  )
} 