import type { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

function getToolLabel(tool: ToolInvocation): string {
  const done = tool.state === "result";
  const args = tool.args as Record<string, string>;
  const filename = args?.path ? args.path.split("/").pop() : undefined;

  if (tool.toolName === "str_replace_editor") {
    switch (args?.command) {
      case "create":
        return done ? `Created ${filename}` : `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return done ? `Edited ${filename}` : `Editing ${filename}`;
      case "view":
        return done ? `Read ${filename}` : `Reading ${filename}`;
      case "undo_edit":
        return done ? "Undone" : "Undoing edit";
    }
  }

  if (tool.toolName === "file_manager") {
    switch (args?.command) {
      case "delete":
        return done ? `Deleted ${filename}` : `Deleting ${filename}`;
      case "rename":
        return done ? `Renamed ${filename}` : `Renaming ${filename}`;
    }
  }

  return tool.toolName;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const label = getToolLabel(toolInvocation);
  const done = toolInvocation.state === "result" && toolInvocation.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

export { getToolLabel };
