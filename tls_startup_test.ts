import net from 'net';
import tls from 'tls';

const host = "dpg-d6ipevsr85hc7382743g.oregon-postgres.render.com";
const port = 5432;
const user = "impostor_game_user";
const database = "impostor_game";

async function test() {
    console.log(`Connecting to ${host}:${port}...`);
    const socket = net.connect(port, host, () => {
        console.log('TCP Connected. Sending SSLRequest...');
        const sslRequest = Buffer.from([0, 0, 0, 8, 4, 210, 22, 47]);
        socket.write(sslRequest);
    });

    socket.on('data', (data) => {
        const response = data.toString();
        if (response === 'S') {
            console.log('Server accepted SSL. Starting TLS upgrade...');
            const tlsSocket = tls.connect({
                socket,
                host,
                port,
                rejectUnauthorized: false,
                servername: host,
            }, () => {
                console.log('TLS Handshake SUCCESS!');

                // Construct StartupMessage
                // Length (4) + Proto (4) + key/value pairs + NULL (1)
                const payload = `user\0${user}\0database\0${database}\0\0`;
                const len = 4 + 4 + payload.length;
                const buffer = Buffer.alloc(len);
                buffer.writeInt32BE(len, 0);
                buffer.writeInt32BE(196608, 4); // Proto 3.0
                buffer.write(payload, 8);

                console.log('Sending StartupMessage...');
                tlsSocket.write(buffer);
            });

            tlsSocket.on('data', (d) => {
                console.log('Received data post-startup:', d.toString());
                // Handle different responses (R=auth, E=error, etc.)
                const type = d[0];
                if (type === 82) { // 'R'
                    console.log('Authentication requested (R)');
                } else if (type === 69) { // 'E'
                    console.log('Error received (E):', d.slice(5).toString());
                } else {
                    console.log('Other response:', d[0]);
                }
                tlsSocket.end();
            });

            tlsSocket.on('error', (err) => {
                console.error('TLS data error:', err.message);
            });
        } else {
            // ... already handled 'N', but let's be brief
        }
    });

    socket.on('error', (err) => {
        console.error('Connection error:', err.message);
    });
}

test();
