// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { CheckCircleIcon as CheckCircle2Icon, InfoCircleIcon as InfoIcon } from "vic-ui/icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "vic-ui/ui"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to
          your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <InfoIcon />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account
          settings.
        </AlertDescription>
      </Alert>
    </div>
  )
}
