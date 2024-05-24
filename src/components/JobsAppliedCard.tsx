import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JobsAppliedCard() {
  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Jobs Applied</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          Create new jobs to apply and track.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>Create New Job</Button>
      </CardFooter>
    </Card>
  );
}
