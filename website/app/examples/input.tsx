// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "vic-ui/ui"
import { Input } from "vic-ui/ui"

export function InputDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-api-key">API Key</FieldLabel>
      <Input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <FieldDescription>
        Your API key is encrypted and stored securely.
      </FieldDescription>
    </Field>
  )
}

export default InputDemo
