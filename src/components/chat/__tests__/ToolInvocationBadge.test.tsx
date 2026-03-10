import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge, getToolLabel } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create in-progress", () => {
  const tool: ToolInvocation = {
    state: "call",
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/src/App.tsx" },
  };
  expect(getToolLabel(tool)).toBe("Creating App.tsx");
});

test("getToolLabel: str_replace_editor create done", () => {
  const tool: ToolInvocation = {
    state: "result",
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/src/App.tsx" },
    result: "ok",
  };
  expect(getToolLabel(tool)).toBe("Created App.tsx");
});

test("getToolLabel: str_replace_editor str_replace in-progress", () => {
  const tool: ToolInvocation = {
    state: "call",
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "Card.tsx" },
  };
  expect(getToolLabel(tool)).toBe("Editing Card.tsx");
});

test("getToolLabel: str_replace_editor str_replace done", () => {
  const tool: ToolInvocation = {
    state: "result",
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "Card.tsx" },
    result: "ok",
  };
  expect(getToolLabel(tool)).toBe("Edited Card.tsx");
});

test("getToolLabel: str_replace_editor view done", () => {
  const tool: ToolInvocation = {
    state: "result",
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "view", path: "index.ts" },
    result: "content",
  };
  expect(getToolLabel(tool)).toBe("Read index.ts");
});

test("getToolLabel: file_manager delete done", () => {
  const tool: ToolInvocation = {
    state: "result",
    toolCallId: "4",
    toolName: "file_manager",
    args: { command: "delete", path: "/src/styles.css" },
    result: "ok",
  };
  expect(getToolLabel(tool)).toBe("Deleted styles.css");
});

test("getToolLabel: file_manager rename in-progress", () => {
  const tool: ToolInvocation = {
    state: "call",
    toolCallId: "5",
    toolName: "file_manager",
    args: { command: "rename", path: "old.tsx", new_path: "new.tsx" },
  };
  expect(getToolLabel(tool)).toBe("Renaming old.tsx");
});

test("getToolLabel: unknown tool falls back to toolName", () => {
  const tool: ToolInvocation = {
    state: "call",
    toolCallId: "6",
    toolName: "unknown_tool",
    args: {},
  };
  expect(getToolLabel(tool)).toBe("unknown_tool");
});

test("getToolLabel: nested path shows only basename", () => {
  const tool: ToolInvocation = {
    state: "call",
    toolCallId: "7",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/src/components/ui/Button.tsx" },
  };
  expect(getToolLabel(tool)).toBe("Creating Button.tsx");
});

// --- Component rendering tests ---

test("ToolInvocationBadge renders label text", () => {
  const tool: ToolInvocation = {
    state: "result",
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "App.tsx" },
    result: "ok",
  };
  render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(screen.getByText("Created App.tsx")).toBeDefined();
});

test("ToolInvocationBadge shows spinner when in-progress", () => {
  const tool: ToolInvocation = {
    state: "call",
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "App.tsx" },
  };
  const { container } = render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("ToolInvocationBadge shows emerald dot when done", () => {
  const tool: ToolInvocation = {
    state: "result",
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "create", path: "App.tsx" },
    result: "ok",
  };
  const { container } = render(<ToolInvocationBadge toolInvocation={tool} />);
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
