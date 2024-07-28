"use client";
import { getResumeList } from "@/actions/profile.actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useEffect, useRef, useState } from "react";
import { Resume } from "@/models/profile.model";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Loading from "../Loading";
import { JobMatchResponse } from "@/models/ai.model";
import { AiJobMatchResponseContent } from "./AiJobMatchResponseContent";

interface AiSectionProps {
  aISectionOpen: boolean;
  triggerChange: (openState: boolean) => void;
  jobId: string;
}

export const AiJobMatchSection = ({
  aISectionOpen,
  triggerChange,
  jobId,
}: AiSectionProps) => {
  const [aIContent, setAIContent] = useState<JobMatchResponse | any>("");
  const [loading, setLoading] = useState(false);

  const resumesRef = useRef<Resume[]>([]);
  const getResumes = async () => {
    try {
      const { data, total, success, message } = await getResumeList();
      if (!data || data.ResumeSections?.length === 0) {
        throw new Error("Resume content is required");
      }
      resumesRef.current = data;
      if (!success) {
        setLoading(false);
        throw new Error(message);
      }
    } catch (error) {
      const message = "Error fetching resume list";
      const description = error instanceof Error ? error.message : message;
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error!",
        description,
      });
    }
  };
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const getJobMatch = async (resumeId: string, jobId: string) => {
    try {
      setLoading(true);
      setAIContent("");
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch("/api/ai/resume/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobId }),
        signal: abortController.signal,
      });

      if (!response.body) {
        setLoading(false);
        throw new Error("No response body");
      }

      if (!response.ok) {
        setLoading(false);
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let done = false;
      setLoading(false);

      while (!done && !abortController.signal.aborted) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;
        const chunk = decoder.decode(value, { stream: !done });
        const parsedChunk = JSON.parse(JSON.stringify(chunk));
        setAIContent((prev: any) => prev + parsedChunk);
      }
      reader.releaseLock();
    } catch (error) {
      const message = "Error fetching job matching response";
      const description = error instanceof Error ? error.message : message;
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error!",
        description,
      });
    }
  };
  const onSelectResume = async (resumeId: string) => {
    await getJobMatch(resumeId, jobId);
  };
  useEffect(() => {
    getResumes();
  }, []);
  return (
    <Sheet open={aISectionOpen} onOpenChange={triggerChange}>
      <SheetPortal>
        <SheetContent className="overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>AI Job Match</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Select onValueChange={onSelectResume}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {resumesRef.current.map((resume) => (
                    <SelectItem
                      key={resume.id}
                      value={resume.id!}
                      className="capitalize"
                    >
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center flex-col">
                <Loading />
                <div>Loading...</div>
              </div>
            ) : (
              <>
                <AiJobMatchResponseContent content={aIContent} />
              </>
            )}
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
};
