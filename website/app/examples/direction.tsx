// Adapted from shadcn/ui (MIT), snapshot 8a35366. See website/upstream.json.
import { DirectionProvider, Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "vic-ui/ui";
export default function DirectionDemo() {
  return <DirectionProvider direction="rtl"><Card dir="rtl" className="w-full max-w-sm">
    <CardHeader><CardTitle>أهلاً بك</CardTitle><CardDescription>واجهة تدعم الكتابة من اليمين إلى اليسار</CardDescription></CardHeader>
    <CardContent><Button>متابعة</Button></CardContent>
  </Card></DirectionProvider>;
}
