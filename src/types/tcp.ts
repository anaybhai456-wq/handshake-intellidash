export type TCPState = 'CLOSED' | 'SYN-SENT' | 'SYN-RECEIVED' | 'ESTABLISHED';

export type PacketType = 'SYN' | 'SYN-ACK' | 'ACK';

export interface Packet {
  id: string;
  type: PacketType;
  sequenceNumber: number;
  acknowledgmentNumber?: number;
  from: 'client' | 'server';
  to: 'client' | 'server';
  timestamp: number;
  lost?: boolean;
  retransmission?: boolean;
}

export interface ConnectionState {
  clientState: TCPState;
  serverState: TCPState;
  clientSeq: number;
  serverSeq: number;
  packets: Packet[];
  isConnected: boolean;
  isSimulating: boolean;
}

export interface SimulationConfig {
  packetLossChance: number;
  animationSpeed: number;
  autoRetransmit: boolean;
}