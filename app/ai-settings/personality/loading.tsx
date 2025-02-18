import { Loading } from '@/components/misc/Loading'

export default function PersonalityLoading() {
  return (
    <Loading>
      <p className="text-sm text-muted-foreground mt-4">
        Loading AI personality settings...
      </p>
    </Loading>
  )
} 