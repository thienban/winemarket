import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    params: Promise<{
        category: string
    }>
}

const Foo = async ({ params }: Props) => {

    const { category } = await params;
    return (
        <div className="p-4">

            <div className="flex flex-col gap-y-4">
                <p className="text-rose-400">Test</p>
                <div>
                    Category: {category}
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
            </div>
        </div>
    );
}

export default Foo;