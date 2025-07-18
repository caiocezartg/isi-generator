import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CodeXml } from "lucide-react";
import { Switch } from "./ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsiStore } from "@/store/use-isi-store";

const ISIValuesSchema = z.object({
  padding: z.coerce
    .number({ message: "Padding needs to be a number" })
    .optional(),
  fontSize: z.coerce
    .number({ message: "Font size needs to be a number" })
    .optional(),
  fontColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
      message: "Font color needs to be a valid hex color",
    })
    .optional(),
  lineHeight: z.coerce
    .number({ message: "Line height needs to be a number" })
    .optional(),
  ISI: z.string().min(1, { message: "ISI text is required" }),
  hasBullets: z.boolean().optional(),
  bulletColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i, {
      message: "Bullet color needs to be a valid hex color",
    })
    .optional(),
});
type ISIValues = z.infer<typeof ISIValuesSchema>;

export default function ISIBannerForm() {
  const { setGeneratedCode } = useIsiStore();

  const form = useForm<ISIValues>({
    resolver: zodResolver(ISIValuesSchema),
    defaultValues: {
      padding: 10,
      fontSize: 16,
      fontColor: "#000000",
      lineHeight: 16,
      ISI: "",
      hasBullets: false,
      bulletColor: "#000000",
    },
  });

  function handleISIValues(data: ISIValues) {
    const { padding, fontSize, fontColor, lineHeight, ISI, bulletColor } = data;

    const generateRow = (
      text: string,
      isBold: boolean = false,
      isBullet: boolean = false,
    ) => {
      if (isBullet) {
        const formattedList = text
          .split("/")
          .map((item) => `<li>${item}</li>`)
          .join("\n\t\t\t");

        return (text = `\n\t\t<ul>\n\t\t\t${formattedList}\n\t\t</ul>`);
      }

      if (isBold) {
        return (text = `\n\t\t<p><strong>${text}</strong></p>`);
      }

      return `\n\t\t<p>${text}</p>`;
    };

    const generatedISIRows = ISI.split(/\r?\n|\r/)
      .filter((row) => row.length > 0)
      .map((text) => {
        if (text.startsWith("**")) return generateRow(text.substring(2), true);
        if (text.startsWith("-"))
          return generateRow(text.substring(1), false, true);
        return generateRow(text);
      })
      .join("");

    const generatedCSS = `#isi_container {\n\tfont-family: Arial, Helvetica, sans-serif;\n\tvisibility: visible;\n\toverflow-y: auto;\n\tbackground-image: none;\n\tbackground-color: rgb(255, 255, 255);\n\tfont-size: ${fontSize}px;\n\tline-height: ${lineHeight}px;\n\toverflow-x: hidden !important;\n}\n\n#isi_container p {\n\tmargin-top: 0px;\n\tcolor: ${fontColor};\n\tfont-size: ${fontSize}px;\n\tmargin-bottom: ${padding}px;\n}\n\n#isi_container h1 {\n\tmargin: 0px 0px 5px;\n\tcolor: ${fontColor};\n\tfont-size: ${Number(fontSize) + 3}px;\n}\n\n#isi_container h2 {\n\tmargin: 0px 0px 5px;\n\tcolor: ${fontColor};\n\tfont-size: ${Number(fontSize) + 2}px;\n\tfont-weight: bold;\n}\n\n#isi_container h3 {\n\tmargin: 5px 0px 0px;\n\tcolor: ${fontColor};\n\tfont-size: ${Number(fontSize) + 1}px;\n}\n\n#isi_container h4 {\n\tmargin: 0px;\n\tfont-size: ${fontSize}px;\n\tcolor: ${fontColor};\n}\n\n#::-webkit-scrollbar {\n\twidth: 6px;\n\tborder-radius: 3px;\n\tpadding-top: 10px;\n}\n\n::-webkit-scrollbar-track {\n\tbox-shadow: rgb(192, 192, 192) 0px 0px 2px inset;\n\tborder-radius: 3px;\n}\n\n::-webkit-scrollbar-thumb {\n\tborder-radius: 3px;\n\tbackground: rgb(2, 0, 67);\n\tbox-shadow: rgb(2, 0, 67) 0px 0px 2px inset;\n}\n\n::-webkit-scrollbar-thumb:window-inactive {\n\tbackground: rgb(85, 119, 137);\n}\n\nul {\n\tpadding-left: 11px;\n\tmargin: 2px 5px;\n\tpadding-inline-start: 10px;\n\tlist-style: none;\n}\n\nul li {\n\tcolor: ${fontColor};\n\tfont-size: ${fontSize}px;\n\tline-height: ${lineHeight}px;\n\tpadding-bottom: 6px;\n\tmargin-left: -6px;\n}\n\nul li::before {\n\tcontent: "•";\n\tcolor: ${bulletColor};\n\tdisplay: inline-block;\n\twidth: 9px;\n\tmargin-left: -9px;\n}\n\nsup {\n\tfont-size: 7px;\n\tvertical-align: baseline;\n\tposition: relative;\n\ttop: -0.4em;\n}\n`;

    const generatedISI = `<div id="isi_container">\n\t<div id="isi">${generatedISIRows}\n\t</div>\n</div>`;

    setGeneratedCode(generatedISI, generatedCSS);
  }

  return (
    <Form {...form}>
      <form
        className="space-y-3 md:grid md:w-full md:grid-cols-2 md:gap-3 md:space-y-0"
        onSubmit={form.handleSubmit(handleISIValues)}
      >
        <FormField
          control={form.control}
          name="padding"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="padding">
                Spacing between lines (px)
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 10px"
                  id="padding"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="font-size">Font size (px)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 12px"
                  id="font-size"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fontColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="font-color">Font color (#)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: #000000"
                  id="font-color"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lineHeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="line-height">Line height (px)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 16px"
                  id="line-height"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasBullets"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="hasBullets"
                />
              </FormControl>
              <FormLabel className="!mt-0" htmlFor="hasBullets">
                Change ISI bullets color
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bulletColor"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: #000000"
                  id="bullet-color"
                  disabled={!form.getValues("hasBullets")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ISI"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="ISI">Your ISI text</FormLabel>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="ml-1 inline-block cursor-pointer text-slate-600"
                >
                  <p>(?)</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="mb-2">
                    Insert the following symbols to format your text:
                  </p>
                  <p>
                    <strong>**</strong>: Bold text
                  </p>
                  <p>
                    <strong>–</strong>: List section - to separate each list
                    item correctly, insert a "/" at the end of each item
                  </p>
                </TooltipContent>
              </Tooltip>
              <FormControl>
                <Textarea
                  className="min-h-60 resize-none scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          className="group relative col-span-2 inline-flex h-12 overflow-hidden rounded-md p-[1px] transition-all duration-700 ease-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          type="submit"
        >
          <span className="bg-conic-purple absolute inset-[-1000%] animate-[spin_2s_linear_infinite] transition-opacity group-hover:opacity-0" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-gradient-to-br from-zinc-900 to-background px-3 py-1 text-base font-medium text-white backdrop-blur-3xl transition-all duration-700 ease-out hover:opacity-70">
            <CodeXml className="mr-2" />
            Generate your code
          </span>
        </button>
      </form>
    </Form>
  );
}
