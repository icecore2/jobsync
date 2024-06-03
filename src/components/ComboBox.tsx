"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { ControllerRenderProps, FieldName } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Job } from "@/models/job.model";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";

export type ComboboxOptions = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOptions[];
  field: ControllerRenderProps<Job, any>;
  onCreate?: (value: string) => void;
}

export function Combobox({ options, field, onCreate }: ComboboxProps) {
  const [newOption, setNewOption] = useState<string>("");
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? options.find((option) => option.value === field.value)?.label
              : `Select ${field.name}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={newOption}
            onValueChange={(val: string) => setNewOption(val)}
            placeholder={`Search ${field.name}`}
          />
          <CommandEmpty
            onClick={() => {
              if (onCreate) {
                onCreate(newOption);
                setNewOption(newOption);
              }
            }}
            className="flex cursor-pointer items-center justify-center gap-1 italic"
          >
            <p>Create: </p>
            <p className="block max-w-48 truncate font-semibold text-primary">
              {newOption}
            </p>
          </CommandEmpty>
          <ScrollArea>
            <CommandGroup>
              <CommandList>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      if (field.onChange) {
                        field.onChange(option.value);
                        setIsPopoverOpen(false);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        option.value === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
