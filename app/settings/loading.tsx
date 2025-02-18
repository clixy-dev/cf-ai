import { Loading } from '@/components/misc/Loading'

export default function SettingsLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading settings...
      </p>
    </Loading>
  )
} 