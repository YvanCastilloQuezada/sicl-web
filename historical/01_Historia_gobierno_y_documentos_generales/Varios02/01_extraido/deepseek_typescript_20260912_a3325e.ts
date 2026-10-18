import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

describe('Integración Mobile ↔ TV', () => {
  let server: http.Server;
  let wss: WebSocketServer;
  const PORT = 8081;

  beforeAll((done) => {
    server = http.createServer();
    wss = new WebSocketServer({ server });
    server.listen(PORT, done);
  });

  afterAll((done) => {
    wss.close();
    server.close(done);
  });

  describe('Handshake completo', () => {
    test('Mobile y TV se emparejan correctamente', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let pairingSuccess = false;

      // Mobile se registra
      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      // TV se registra
      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      // Mobile recibe PAIRING_REQUEST
      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          // Mobile acepta
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          pairingSuccess = true;
          expect(pairingSuccess).toBe(true);
          mobileWs.close();
          tvWs.close();
          done();
        }
      });

      // TV recibe PAIRING_SUCCESS
      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        if (packet.type === 'PAIRING_SUCCESS') {
          expect(packet.mobileId).toBeDefined();
        }
      });
    });
  });

  describe('Intercambio SDP', () => {
    test('Mobile envía SDP_OFFER y TV responde con SDP_ANSWER', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let sdpAnswerReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          // Mobile envía SDP_OFFER
          mobileWs.send(JSON.stringify({
            type: 'SDP_OFFER',
            tvId: packet.tvId,
            sdp: { type: 'offer', sdp: 'test-offer-sdp' }
          }));
        }
        
        if (packet.type === 'SDP_ANSWER') {
          sdpAnswerReceived = true;
          expect(sdpAnswerReceived).toBe(true);
          expect(packet.sdp).toBeDefined();
          mobileWs.close();
          tvWs.close();
          done();
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'SDP_OFFER') {
          // TV responde con SDP_ANSWER
          tvWs.send(JSON.stringify({
            type: 'SDP_ANSWER',
            tvId: packet.from,
            sdp: { type: 'answer', sdp: 'test-answer-sdp' }
          }));
        }
      });
    });
  });

  describe('Intercambio ICE', () => {
    test('Mobile y TV intercambian ICE candidates', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let iceCandidateReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'ICE_CANDIDATE') {
          iceCandidateReceived = true;
          expect(iceCandidateReceived).toBe(true);
          mobileWs.close();
          tvWs.close();
          done();
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_SUCCESS') {
          // TV envía ICE_CANDIDATE
          tvWs.send(JSON.stringify({
            type: 'ICE_CANDIDATE',
            tvId: packet.mobileId,
            candidate: { candidate: 'test-ice-candidate' }
          }));
        }
      });
    });
  });

  describe('Flujo completo', () => {
    test('Handshake completo: REGISTER → PAIRING → SDP → ICE → CONNECTED', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      const steps: string[] = [];

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
        steps.push('MOBILE_REGISTERED');
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
        steps.push('TV_REGISTERED');
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
          steps.push('PAIRING_ACCEPTED');
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          mobileWs.send(JSON.stringify({
            type: 'SDP_OFFER',
            tvId: packet.tvId,
            sdp: { type: 'offer', sdp: 'test-offer-sdp' }
          }));
          steps.push('SDP_OFFER_SENT');
        }
        
        if (packet.type === 'SDP_ANSWER') {
          steps.push('SDP_ANSWER_RECEIVED');
        }
        
        if (packet.type === 'ICE_CANDIDATE') {
          steps.push('ICE_CANDIDATE_RECEIVED');
          
          // Verificar que se completaron todos los pasos
          expect(steps).toContain('MOBILE_REGISTERED');
          expect(steps).toContain('TV_REGISTERED');
          expect(steps).toContain('PAIRING_ACCEPTED');
          expect(steps).toContain('SDP_OFFER_SENT');
          expect(steps).toContain('SDP_ANSWER_RECEIVED');
          expect(steps).toContain('ICE_CANDIDATE_RECEIVED');
          
          mobileWs.close();
          tvWs.close();
          done();
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'SDP_OFFER') {
          tvWs.send(JSON.stringify({
            type: 'SDP_ANSWER',
            tvId: packet.from,
            sdp: { type: 'answer', sdp: 'test-answer-sdp' }
          }));
        }
      });
    });
  });

  describe('Comandos del D-Pad', () => {
    test('Mobile envía comando UP y TV lo recibe', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let commandReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          // Simular envío de comando
          mobileWs.send(JSON.stringify({
            type: 'COMMAND',
            action: 'UP'
          }));
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'COMMAND') {
          commandReceived = true;
          expect(packet.action).toBe('UP');
          mobileWs.close();
          tvWs.close();
          done();
        }
      });
    });

    test('Mobile envía comando DOWN y TV lo recibe', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let commandReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          mobileWs.send(JSON.stringify({
            type: 'COMMAND',
            action: 'DOWN'
          }));
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'COMMAND') {
          commandReceived = true;
          expect(packet.action).toBe('DOWN');
          mobileWs.close();
          tvWs.close();
          done();
        }
      });
    });

    test('Mobile envía comando LEFT y TV lo recibe', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let commandReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          mobileWs.send(JSON.stringify({
            type: 'COMMAND',
            action: 'LEFT'
          }));
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'COMMAND') {
          commandReceived = true;
          expect(packet.action).toBe('LEFT');
          mobileWs.close();
          tvWs.close();
          done();
        }
      });
    });

    test('Mobile envía comando RIGHT y TV lo recibe', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let commandReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_REQUEST') {
          mobileWs.send(JSON.stringify({
            type: 'ACCEPT_PAIRING',
            tvId: packet.tvId
          }));
        }
        
        if (packet.type === 'PAIRING_SUCCESS') {
          mobileWs.send(JSON.stringify({
            type: 'COMMAND',
            action: 'RIGHT'
          }));
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'COMMAND') {
          commandReceived = true;
          expect(packet.action).toBe('RIGHT');
          mobileWs.close();
          tvWs.close();
          done();
        }
      });
    });
  });

  describe('Reconexión', () => {
    test('Mobile solicita RECONNECT', (done) => {
      const mobileWs = new WebSocket(`ws://localhost:${PORT}`);
      const tvWs = new WebSocket(`ws://localhost:${PORT}`);
      let reconnectReceived = false;

      mobileWs.on('open', () => {
        mobileWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'MOBILE'
        }));
      });

      tvWs.on('open', () => {
        tvWs.send(JSON.stringify({
          type: 'REGISTER',
          deviceType: 'TV',
          tvName: 'Smart TV Test'
        }));
      });

      mobileWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'PAIRING_SUCCESS') {
          mobileWs.send(JSON.stringify({
            type: 'RECONNECT',
            tvId: packet.tvId
          }));
        }
      });

      tvWs.on('message', (data) => {
        const packet = JSON.parse(data.toString());
        
        if (packet.type === 'RECONNECT') {
          reconnectReceived = true;
          expect(reconnectReceived).toBe(true);
          mobileWs.close();
          tvWs.close();
          done();
        }
      });
    });
  });
});