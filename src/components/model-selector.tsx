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
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[225px]">
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        {aimodels.map((aimodel) => (
          <SelectItem key={aimodel.name} value={aimodel.name}>
            {aimodel.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}