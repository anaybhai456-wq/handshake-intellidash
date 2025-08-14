import { useState, useCallback } from 'react';
import { ConnectionState, Packet, SimulationConfig, TCPState, PacketType } from '@/types/tcp';

const generateRandomSeq = () => Math.floor(Math.random() * 1000) + 1000;

const createPacket = (
  type: PacketType,
  from: 'client' | 'server',
  to: 'client' | 'server',
  sequenceNumber: number,
  acknowledgmentNumber?: number,
  retransmission = false
): Packet => ({
  id: Math.random().toString(36).substr(2, 9),
  type,
  from,
  to,
  sequenceNumber,
  acknowledgmentNumber,
  timestamp: Date.now(),
  retransmission
});

export const useTCPSimulator = () => {
  const [state, setState] = useState<ConnectionState>({
    clientState: 'CLOSED',
    serverState: 'CLOSED',
    clientSeq: generateRandomSeq(),
    serverSeq: generateRandomSeq(),
    packets: [],
    isConnected: false,
    isSimulating: false
  });

  const [config, setConfig] = useState<SimulationConfig>({
    packetLossChance: 20,
    animationSpeed: 1,
    autoRetransmit: true
  });

  const [currentPacket, setCurrentPacket] = useState<Packet | null>(null);

  const simulatePacketLoss = () => Math.random() * 100 < config.packetLossChance;

  const delay = (ms: number) => new Promise(resolve => 
    setTimeout(resolve, ms / config.animationSpeed)
  );

  const sendPacket = async (packet: Packet): Promise<boolean> => {
    setCurrentPacket(packet);
    
    await delay(1000); // Animation time
    
    const lost = simulatePacketLoss();
    const finalPacket = { ...packet, lost };
    
    setState(prev => ({
      ...prev,
      packets: [...prev.packets, finalPacket]
    }));
    
    setCurrentPacket(null);
    await delay(500);
    
    return !lost;
  };

  const updateStates = (clientState: TCPState, serverState: TCPState) => {
    setState(prev => ({
      ...prev,
      clientState,
      serverState,
      isConnected: clientState === 'ESTABLISHED' && serverState === 'ESTABLISHED'
    }));
  };

  const startHandshake = useCallback(async () => {
    if (state.isSimulating) return;

    setState(prev => ({ ...prev, isSimulating: true }));

    try {
      // Step 1: Client sends SYN
      updateStates('SYN-SENT', 'CLOSED');
      
      let synPacket = createPacket('SYN', 'client', 'server', state.clientSeq);
      let synSuccess = await sendPacket(synPacket);
      
      // Retry SYN if lost and auto-retransmit is enabled
      if (!synSuccess && config.autoRetransmit) {
        await delay(1000);
        synPacket = createPacket('SYN', 'client', 'server', state.clientSeq, undefined, true);
        synSuccess = await sendPacket(synPacket);
      }
      
      if (!synSuccess) {
        updateStates('CLOSED', 'CLOSED');
        setState(prev => ({ ...prev, isSimulating: false }));
        return;
      }

      // Step 2: Server responds with SYN-ACK
      updateStates('SYN-SENT', 'SYN-RECEIVED');
      await delay(500);
      
      let synAckPacket = createPacket(
        'SYN-ACK', 
        'server', 
        'client', 
        state.serverSeq, 
        state.clientSeq + 1
      );
      let synAckSuccess = await sendPacket(synAckPacket);
      
      // Retry SYN-ACK if lost
      if (!synAckSuccess && config.autoRetransmit) {
        await delay(1000);
        synAckPacket = createPacket(
          'SYN-ACK', 
          'server', 
          'client', 
          state.serverSeq, 
          state.clientSeq + 1,
          true
        );
        synAckSuccess = await sendPacket(synAckPacket);
      }
      
      if (!synAckSuccess) {
        updateStates('CLOSED', 'CLOSED');
        setState(prev => ({ ...prev, isSimulating: false }));
        return;
      }

      // Step 3: Client sends final ACK
      await delay(500);
      
      let ackPacket = createPacket(
        'ACK', 
        'client', 
        'server', 
        state.clientSeq + 1, 
        state.serverSeq + 1
      );
      let ackSuccess = await sendPacket(ackPacket);
      
      // Retry ACK if lost
      if (!ackSuccess && config.autoRetransmit) {
        await delay(1000);
        ackPacket = createPacket(
          'ACK', 
          'client', 
          'server', 
          state.clientSeq + 1, 
          state.serverSeq + 1,
          true
        );
        ackSuccess = await sendPacket(ackPacket);
      }

      // Connection established
      if (ackSuccess) {
        updateStates('ESTABLISHED', 'ESTABLISHED');
      } else {
        updateStates('CLOSED', 'CLOSED');
      }

    } catch (error) {
      console.error('Handshake simulation error:', error);
      updateStates('CLOSED', 'CLOSED');
    } finally {
      setState(prev => ({ ...prev, isSimulating: false }));
    }
  }, [state.clientSeq, state.serverSeq, state.isSimulating, config]);

  const resetSimulation = useCallback(() => {
    setState({
      clientState: 'CLOSED',
      serverState: 'CLOSED',
      clientSeq: generateRandomSeq(),
      serverSeq: generateRandomSeq(),
      packets: [],
      isConnected: false,
      isSimulating: false
    });
    setCurrentPacket(null);
  }, []);

  const pauseSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isSimulating: false }));
  }, []);

  const updateConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  return {
    state,
    config,
    currentPacket,
    startHandshake,
    resetSimulation,
    pauseSimulation,
    updateConfig
  };
};