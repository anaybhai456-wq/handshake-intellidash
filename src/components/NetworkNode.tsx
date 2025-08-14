import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TCPState } from "@/types/tcp";
import { Monitor, Server } from "lucide-react";

interface NetworkNodeProps {
  type: 'client' | 'server';
  state: TCPState;
  sequenceNumber: number;
  className?: string;
}

const stateColors = {
  'CLOSED': 'bg-muted text-muted-foreground',
  'SYN-SENT': 'bg-network-warning/20 text-network-warning border-network-warning',
  'SYN-RECEIVED': 'bg-network-client/20 text-network-client border-network-client',
  'ESTABLISHED': 'bg-network-success/20 text-network-success border-network-success animate-pulse-glow'
};

export const NetworkNode = ({ type, state, sequenceNumber, className }: NetworkNodeProps) => {
  const Icon = type === 'client' ? Monitor : Server;
  
  return (
    <Card className={cn(
      "p-6 glass-card transition-all duration-500",
      state === 'ESTABLISHED' && "shadow-lg shadow-network-success/20",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "p-4 rounded-full transition-colors duration-500",
          type === 'client' ? "bg-network-client/20" : "bg-network-server/20"
        )}>
          <Icon className={cn(
            "w-8 h-8",
            type === 'client' ? "text-network-client" : "text-network-server"
          )} />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1 text-xs font-mono border-2 transition-all duration-500",
              stateColors[state]
            )}
          >
            {state}
          </Badge>
          <div className="text-sm text-muted-foreground">
            <span className="font-mono">SEQ: {sequenceNumber}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};