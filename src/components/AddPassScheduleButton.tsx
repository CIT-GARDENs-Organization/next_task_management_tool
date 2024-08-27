"use client";
import useSWR from "swr";
import {Button} from "@/components/ui/button";
import {createClient} from "@supabase/supabase-js";
import {Database} from "@/types/supabase";
import {Check, ChevronsUpDown, CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format} from "date-fns";

import {useState, useEffect, useMemo} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {Separator} from "@/components/ui/separator";
import {Calendar} from "@/components/ui/calendar";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

// Supabaseクライアントのセットアップ
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// データフェッチ用の関数
const satelliteListFetcher = async () => {
  const {data, error} = await supabase.from("satellite_list").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const passScheduleFetcher = async () => {
  const {data, error} = await supabase.from("pass_schedule").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function AddPassScheduleButton() {
  const [open, setOpen] = useState(false);
  const [passId, setPassId] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState<Date>();

  const [uploadData, setUploadData] =
    useState<Database["public"]["Tables"]["pass_schedule"]["Row"]>();

  const {data: satelliteList, error: satelliteListError} = useSWR(
    "satellite_list",
    satelliteListFetcher
  );

  const {data: passScheduleList, error: passScheduleError} = useSWR(
    "pass_schedule",
    passScheduleFetcher
  );

  const selectedSatellitePassScheduleList = useMemo(() => {
    return passScheduleList
      ? passScheduleList.filter(
          (passSchedule) =>
            passSchedule.satellite_name === uploadData?.satellite_name
        )
      : [];
  }, [passScheduleList, uploadData]);

  useEffect(() => {
    setPassId(selectedSatellitePassScheduleList.length + 1);
  }, [selectedSatellitePassScheduleList]);

  if (satelliteListError || passScheduleError)
    return <div>Error loading data...</div>;
  if (!satelliteList || !passScheduleList) return <div>Loading...</div>;

  const handleSave = async () => {
    setSaving(true);
    const {error} = await supabase.from("pass_schedule").insert([
      {
        pass_id: passId,
        satellite_name: uploadData?.satellite_name,
      },
    ]);
    setSaving(false);
    if (error) {
      console.error("Error saving data: ", error.message);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>パスを追加</Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl">
        <DialogHeader>
          <DialogTitle>パス計画の追加</DialogTitle>
          <DialogDescription>新しいパス計画を追加します</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Satellite Name
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {uploadData?.satellite_name
                    ? satelliteList.find(
                        (satellite) =>
                          satellite.name === uploadData?.satellite_name
                      )?.name
                    : "Select a satellite"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search Satellite..." />
                  <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    <CommandGroup>
                      {satelliteList.map((satelliteList) => (
                        <CommandItem
                          key={satelliteList.name}
                          value={satelliteList.name}
                          onSelect={(currentValue) => {
                            setUploadData((prevState) => ({
                              ...prevState,
                              satellite_name: currentValue,
                              created_at: prevState?.created_at ?? "",
                              end_time: prevState?.end_time ?? null,
                              id: prevState?.id ?? "",
                              pass_id: prevState?.pass_id ?? null,
                              start_time: prevState?.start_time ?? null,
                            }));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              uploadData?.satellite_name === satelliteList.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {satelliteList.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* 衛星が選択されている場合のみ表示 */}
          {uploadData?.satellite_name && (
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Pass ID
                </Label>
                <Label className="px-2">{passId}</Label>
              </div>
              <Separator className="my-8" />
              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="name" className="text-right">
                  AOS Date & Time (JTC)
                </Label>
                {/* DatePicker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="name" className="text-right"></Label>
                {/* Time */}
                <div className="grid grid-cols-3 gap-4">
                  {/* HH:MM:SS */}
                  <div className="w-96 flex gap-4">
                    <Input
                      type="number"
                      placeholder="HH"
                      min={0}
                      max={23}
                      className="w-24"
                    />
                    <Input
                      type="number"
                      placeholder="MM"
                      min={0}
                      max={59}
                      className="w-24"
                    />
                    <Input
                      type="number"
                      placeholder="SS"
                      min={0}
                      max={59}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="name" className="text-right">
                  Pass Duration
                </Label>
                <div className="w-96 flex gap-4">
                  <Input
                    type="number"
                    placeholder="MM"
                    min={0}
                    max={59}
                    className="w-24"
                  />
                  <Input
                    type="number"
                    placeholder="SS"
                    min={0}
                    max={59}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            {/* 衛星が選択されている時のみdisable */}
            <Button
              type="submit"
              onClick={handleSave}
              disabled={!uploadData?.satellite_name || saving}
            >
              {saving ? "保存中..." : "追加する"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
