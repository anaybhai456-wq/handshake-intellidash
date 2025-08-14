import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw, Pause, Wifi, WifiOff } from "lucide-react";
import { SimulationConfig } from "@/types/tcp";
import { cn } from "@/lib/utils";

interface HandshakeControlsProps {
  isSimulating: boolean;
  isConnected: boolean;
  config: SimulationConfig;
  onStart: () => void;
  onReset: () => void;
  onPause: () => void;
  onConfigChange: (config: Partial<SimulationConfig>) => void;
}

export const HandshakeControls = ({
  isSimulating,
  isConnected,
  config,
  onStart,
  onReset, 
  onPause,
  onConfigChange
}: HandshakeControlsProps) => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Simulation Controls</h3>
          <Badge 
            variant="outline"
            className={cn(
              "px-3 py-1 border-2",
              isConnected 
                ? "bg-network-success/20 text-network-success border-network-success" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </>
            )}
          </Badge>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onStart}
            disabled={isSimulating}
            className="flex-1"
            variant="default"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Handshake
          </Button>
          
          {isSimulating && (
            <Button
              onClick={onPause}
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={onReset}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Packet Loss Chance: {config.packetLossChance}%
            </Label>
            <Slider
              value={[config.packetLossChance]}
              onValueChange={([value]) => onConfigChange({ packetLossChance: value })}
              max={50}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Animation Speed: {config.animationSpeed}x
            </Label>
            <Slider
              value={[config.animationSpeed]}
              onValueChange={([value]) => onConfigChange({ animationSpeed: value })}
              min={0.5}
              max={3}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-retransmit"
              checked={config.autoRetransmit}
              onCheckedChange={(checked) => onConfigChange({ autoRetransmit: checked })}
            />
            <Label htmlFor="auto-retransmit" className="text-sm">
              Auto-retransmit lost packets
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
};