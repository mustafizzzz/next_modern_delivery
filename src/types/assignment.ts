export type Assignment = {
  _id: string
  orderId: string
  partnerId: string
  timestamp: string
  status: "success" | "failed"
  reason?: string
}

export type AssignmentMetrics = {
  totalAssigned: number
  successRate: number
  averageTime: number
  failureReasons: {
    reason: string
    count: number
  }[]
}

export type AssignmentPageProps = {
  assignments: Assignment[]
  metrics: AssignmentMetrics
  partners: {
    available: number
    busy: number
    offline: number
  }
}

export type ApiResponse = {
  success: boolean
  message: string
  assignments: Assignment[]
}

