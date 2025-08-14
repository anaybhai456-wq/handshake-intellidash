import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Packet } from "@/types/tcp";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight, X, RotateCcw } from "lucide-react";

interface LogDisplayProps {
  packets: Packet[];
  className?: string;
}

const packetTypeColors = {
  'SYN': 'text-network-client',
  'SYN-ACK': 'text-network-server', 
  'ACK': 'text-network-success'
};

export const LogDisplay = ({ packets, className }: LogDisplayProps) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${timeStr}.${ms}`;
  };

  const getLogMessage = (packet: Packet) => {
    const direction = packet.from === 'client' ? 'Client → Server' : 'Server → Client';
    let message = `${direction}: ${packet.type}`;
    
    if (packet.acknowledgmentNumber) {
      message += ` (ACK: ${packet.acknowledgmentNumber})`;
    }
    
    if (packet.lost) {
      message += ' - PACKET LOST';
    }
    
    if (packet.retransmission) {
      message += ' - RETRANSMISSION';
    }
    
    return message;
  };

  return (
    <Card className={cn("p-4 bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Network Log</h3>
          <Badge variant="outline" className="ml-auto">
            {packets.length} packets
          </Badge>
        </div>
        
        <ScrollArea className="h-64 w-full">
          <div className="space-y-2">
            {packets.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p className="text-sm">No network activity yet</p>
              </div>
            ) : (
              packets.map((packet) => (
                <div
                  key={packet.id}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200",
                    "bg-muted/20 hover:bg-muted/40",
                    packet.lost && "border-network-error/50 bg-network-error/5",
                    packet.retransmission && "border-network-warning/50 bg-network-warning/5"
                  )}
                >
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(packet.timestamp)}</span>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs px-2 py-0.5",
                          packetTypeColors[packet.type]
                        )}
                      >
                        {packet.type}
                      </Badge>
                      
                      {packet.lost && (
                        <X className="w-3 h-3 text-network-error" />
                      )}
                      
                      {packet.retransmission && (
                        <RotateCcw className="w-3 h-3 text-network-warning" />
                      )}
                      
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                    
                    <p className="text-sm text-foreground">
                      {getLogMessage(packet)}
                    </p>
                    
                    <div className="text-xs text-muted-foreground font-mono">
                      SEQ: {packet.sequenceNumber}
                      {packet.acknowledgmentNumber && ` | ACK: ${packet.acknowledgmentNumber}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};