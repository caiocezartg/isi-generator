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
  padding: z.coerce.number().optional(),
  fontSize: z.coerce.number().optional(),
  fontColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i)
    .optional(),
  tableColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i)
    .optional(),
  lineHeight: z.coerce.number().optional(),
  gutterWidth: z.coerce.number().optional(),
  ISI: z.string().min(1, { message: "ISI text is required" }),
  hasBullets: z.boolean().optional(),
  bulletColor: z
    .string()
    .regex(/^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))$|^$/i)
    .optional(),
});

type ISIValues = z.infer<typeof ISIValuesSchema>;

export default function ISIEmailForm() {
  const { formText, setGeneratedCode } = useIsiStore();

  const form = useForm<ISIValues>({
    resolver: zodResolver(ISIValuesSchema),
    defaultValues: {
      padding: 10,
      fontSize: 16,
      fontColor: "#000000",
      tableColor: "#FFFFFE",
      lineHeight: 16,
      gutterWidth: 30,
      ISI: formText,
      hasBullets: false,
      bulletColor: "#000000",
    },
  });

  function handleISIValues(values: ISIValues) {
    const {
      padding,
      fontSize,
      fontColor,
      tableColor,
      lineHeight,
      gutterWidth,
      ISI,
      bulletColor,
    } = values;

    const generateRow = (
      text: string,
      isBold: boolean = false,
      isBullet: boolean = false,
    ) => {
      const commonStyle = `font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; line-height: ${lineHeight}px; color: ${fontColor}; padding-bottom: ${padding}px; font-weight: ${isBold ? "bold" : "normal"};`;
      if (isBullet) {
        return `\n\t\t\t\t<tr>\n\t\t\t\t\t<td>\n\t\t\t\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td width="12" valign="top" align="left" style="font-family: Arial, Helvetica, sans-serif; font-size: ${fontSize}px; line-height: ${lineHeight}px; color: ${bulletColor}; padding-bottom: ${padding}px; font-weight: bold;">•</td>\n\t\t\t\t\t\t\t\t<td valign="top" align="left" style="${commonStyle}">${text}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</table>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>`;
      }
      return `\n\t\t\t\t<tr>\n\t\t\t\t\t<td align="left" style="${commonStyle}">\n\t\t\t\t\t\t${text}\n\t\t\t\t\t</td>\n\t\t\t\t</tr>`;
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

    const generatedISI = `<table cellpadding="0" cellspacing="0" border="0" width="600" style="min-width: 600px;" class="wrapper" role="presentation" bgcolor="${tableColor || "#FFFFFE"}">\n\t<tr>\n\t\t<td width="${gutterWidth || "30"}" class="gutter">&nbsp;</td>\n\t\t<td>\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%">${generatedISIRows}\n\t\t\t</table>\n\t\t</td>\n\t\t<td width="${gutterWidth || "30"}" class="gutter">&nbsp;</td>\n\t</tr>\n</table>`;

    setGeneratedCode(generatedISI);
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
          name="tableColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="table-color">Table color (#)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: #FFFFFE"
                  id="table-color"
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
          name="gutterWidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="gutter-width">Gutter width (px)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Default: 30px"
                  id="gutter-width"
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
                    <strong>&ndash;</strong>: Bullet point
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
