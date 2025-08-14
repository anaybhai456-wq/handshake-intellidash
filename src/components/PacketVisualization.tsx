import { cn } from "@/lib/utils";
import { Packet } from "@/types/tcp";
import { ArrowRight, X, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PacketVisualizationProps {
  packet?: Packet;
  isAnimating: boolean;
  className?: string;
}

const packetTypeColors = {
  'SYN': 'bg-network-client/20 text-network-client border-network-client',
  'SYN-ACK': 'bg-network-server/20 text-network-server border-network-server', 
  'ACK': 'bg-network-success/20 text-network-success border-network-success'
};

export const PacketVisualization = ({ packet, isAnimating, className }: PacketVisualizationProps) => {
  if (!packet) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
          <ArrowRight className="w-6 h-6" />
          <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-8 relative", className)}>
      <div className="flex items-center space-x-4 w-full max-w-md">
        {/* Source indicator */}
        <div className={cn(
          "w-4 h-4 rounded-full transition-all duration-300",
          packet.from === 'client' ? "bg-network-client" : "bg-network-server"
        )} />
        
        {/* Packet flow */}
        <div className="flex-1 relative">
          <div className="h-0.5 bg-border w-full" />
          
          {/* Animated packet */}
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 transition-all duration-1000",
            isAnimating && "animate-packet-flow",
            packet.from === 'client' ? "left-0" : "right-0"
          )}>
            <div className="relative">
              <Badge 
                variant="outline"
                className={cn(
                  "px-3 py-1 text-xs font-mono border-2 whitespace-nowrap shadow-lg",
                  packetTypeColors[packet.type],
                  packet.lost && "opacity-50"
                )}
              >
                {packet.retransmission && <RotateCcw className="w-3 h-3 inline mr-1" />}
                {packet.lost && <X className="w-3 h-3 inline mr-1" />}
                {packet.type}
                {packet.acknowledgmentNumber && (
                  <span className="ml-2 text-xs">ACK:{packet.acknowledgmentNumber}</span>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Destination indicator */}
        <div className={cn(
          "w-4 h-4 rounded-full transition-all duration-300",
          packet.to === 'client' ? "bg-network-client" : "bg-network-server"
        )} />
      </div>
    </div>
  );
};