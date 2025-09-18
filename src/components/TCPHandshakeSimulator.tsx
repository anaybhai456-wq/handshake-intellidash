import { NetworkNode } from "@/components/NetworkNode";
import { PacketVisualization } from "@/components/PacketVisualization";
import { HandshakeControls } from "@/components/HandshakeControls";
import { LogDisplay } from "@/components/LogDisplay";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTCPSimulator } from "@/hooks/useTCPSimulator";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Network, Info } from "lucide-react";

export const TCPHandshakeSimulator = () => {
  const {
    state,
    config,
    currentPacket,
    startHandshake,
    resetSimulation,
    pauseSimulation,
    updateConfig
  } = useTCPSimulator();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Network className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TCP 3-Way Handshake Simulator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive visualization of the TCP connection establishment process with packet loss simulation and state tracking
          </p>
        </div>

        {/* Main Visualization */}
        <Card className="p-8 glass-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Client */}
            <NetworkNode
              type="client"
              state={state.clientState}
              sequenceNumber={state.clientSeq}
              className="justify-self-center"
            />

            {/* Packet Visualization */}
            <div className="space-y-4">
              <PacketVisualization
                packet={currentPacket}
                isAnimating={!!currentPacket}
              />
              
              {/* Current Step Indicator */}
              <div className="flex justify-center">
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  {state.isSimulating ? "Simulating..." : "Ready"}
                </Badge>
              </div>
            </div>

            {/* Server */}
            <NetworkNode
              type="server"
              state={state.serverState}
              sequenceNumber={state.serverSeq}
              className="justify-self-center"
            />
          </div>
        </Card>

        {/* Controls and Information */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="xl:col-span-1">
            <HandshakeControls
              isSimulating={state.isSimulating}
              isConnected={state.isConnected}
              config={config}
              onStart={startHandshake}
              onReset={resetSimulation}
              onPause={pauseSimulation}
              onConfigChange={updateConfig}
            />
          </div>

          {/* Log Display */}
          <div className="xl:col-span-2">
            <LogDisplay packets={state.packets} />
          </div>
        </div>

        {/* Information Panel */}
        <Card className="p-6 glass-card">
          <div className="flex items-start space-x-4">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How TCP 3-Way Handshake Works</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-network-client border-network-client">
                    Step 1: SYN
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Client sends a SYN packet with initial sequence number to initiate connection
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="text-network-server border-network-server">
                    Step 2: SYN-ACK
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Server acknowledges with SYN-ACK, containing its own sequence number
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className="text-network-success border-network-success">
                    Step 3: ACK
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Client sends final ACK to complete the handshake and establish connection
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Features Demonstrated:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Sequence number synchronization</li>
                    <li>• TCP state transitions</li>
                    <li>• Packet loss simulation</li>
                    <li>• Automatic retransmission</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">TCP States:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <span className="font-mono">CLOSED</span> - No connection</li>
                    <li>• <span className="font-mono">SYN-SENT</span> - Client waiting for SYN-ACK</li>
                    <li>• <span className="font-mono">SYN-RECEIVED</span> - Server waiting for ACK</li>
                    <li>• <span className="font-mono">ESTABLISHED</span> - Connection ready</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};