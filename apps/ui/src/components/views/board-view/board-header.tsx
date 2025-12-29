import { HotkeyButton } from '@/components/ui/hotkey-button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Bot, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { ClaudeUsagePopover } from '@/components/claude-usage-popover';
import { useAppStore } from '@/store/app-store';

interface BoardHeaderProps {
  projectName: string;
  maxConcurrency: number;
  runningAgentsCount: number;
  onConcurrencyChange: (value: number) => void;
  isAutoModeRunning: boolean;
  onAutoModeToggle: (enabled: boolean) => void;
  onAddFeature: () => void;
  addFeatureShortcut: KeyboardShortcut;
  isMounted: boolean;
}

export function BoardHeader({
  projectName,
  maxConcurrency,
  runningAgentsCount,
  onConcurrencyChange,
  isAutoModeRunning,
  onAutoModeToggle,
  onAddFeature,
  addFeatureShortcut,
  isMounted,
}: BoardHeaderProps) {
  const apiKeys = useAppStore((state) => state.apiKeys);

  // Hide usage tracking when using API key (only show for Claude Code CLI users)
  // Also hide on Windows for now (CLI usage command not supported)
  const isWindows =
    typeof navigator !== 'undefined' && navigator.platform?.toLowerCase().includes('win');
  const showUsageTracking = !apiKeys.anthropic && !isWindows;

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-glass backdrop-blur-md">
      <div>
        <h1 className="text-xl font-bold">Kanban Board</h1>
        <p className="text-sm text-muted-foreground">{projectName}</p>
      </div>
      <div className="flex gap-2 items-center">
        {/* Usage Popover - only show for CLI users (not API key users) */}
        {isMounted && showUsageTracking && <ClaudeUsagePopover />}

        {/* Concurrency Counter - only show after mount to prevent hydration issues */}
        {isMounted && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border"
            data-testid="concurrency-counter-container"
          >
            <Bot className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Agents</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onConcurrencyChange(Math.max(1, maxConcurrency - 1))}
                disabled={maxConcurrency <= 1}
                className="h-6 w-6 p-0"
                data-testid="concurrency-decrease-button"
                title="Decrease agent count"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span
                className="text-sm text-muted-foreground min-w-[5ch] text-center font-medium"
                data-testid="concurrency-value"
              >
                {runningAgentsCount} / {maxConcurrency}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onConcurrencyChange(Math.min(10, maxConcurrency + 1))}
                disabled={maxConcurrency >= 10}
                className="h-6 w-6 p-0"
                data-testid="concurrency-increase-button"
                title="Increase agent count"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Auto Mode Toggle - only show after mount to prevent hydration issues */}
        {isMounted && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
            <Label htmlFor="auto-mode-toggle" className="text-sm font-medium cursor-pointer">
              Auto Mode
            </Label>
            <Switch
              id="auto-mode-toggle"
              checked={isAutoModeRunning}
              onCheckedChange={onAutoModeToggle}
              data-testid="auto-mode-toggle"
            />
          </div>
        )}

        <HotkeyButton
          size="sm"
          onClick={onAddFeature}
          hotkey={addFeatureShortcut}
          hotkeyActive={false}
          data-testid="add-feature-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </HotkeyButton>
      </div>
    </div>
  );
}
