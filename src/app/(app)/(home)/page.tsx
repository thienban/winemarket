"use client";

import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {

  const trpc = useTRPC();
  const categories = useQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="p-4">
      <div className="flex flex-col gap-y-4">
        <p className="text-rose-400">Test</p>
        <div>
          <Button variant={"primElevated"}>{JSON.stringify(categories.data, null, 2)}</Button>
        </div>
        <div>
          <Button variant={"elevated"}>Button</Button>
        </div>
        <div>
          <Progress value={50} />
        </div> <div>
          <Input placeholder="TTTTT" />
        </div>
        <div>
          <Textarea placeholder="TTTTT" />
        </div>
        <div>
          <Checkbox />
        </div>
      </div>
    </div>
  );
}
