import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIModel } from "@/aimodel";

interface ModelSelectorProps {
  value: string;
  aimodels: AIModel[];
  onValueChange: (value: string) => void;
}

export function ModelSelector({aimodels, value, onValueChange }: ModelSelectorProps) {
  return (
    <Select  value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[225px] yellowselect" style={{
        textShadow:"0 0 1px #ffa500, 0 0 2px #ffa500"
      }}>
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        {aimodels.map((aimodel) => (
          <SelectItem className="yellowselect" key={aimodel.name} value={aimodel.name}>
            {aimodel.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}