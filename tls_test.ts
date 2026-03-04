import net from 'net';
import tls from 'tls';

const host = 'dpg-d6ipevsr85hc7382743g.oregon-postgres.render.com';
const port = 5432;

async function test() {
    console.log(`Connecting to ${host}:${port}...`);
    const socket = net.connect(port, host, () => {
        console.log('TCP Connected. Sending SSLRequest...');
        // SSLRequest: Length (8), Code (80877103)
        const sslRequest = Buffer.from([0, 0, 0, 8, 4, 210, 22, 47]);
        socket.write(sslRequest);
    });

    socket.on('data', (data) => {
        const response = data.toString();
        console.log(`Server response: ${response}`);
        if (response === 'S') {
            console.log('SSL Required/Requested. Starting TLS upgrade...');
            const tlsSocket = tls.connect({
                socket,
                host,
                port,
                rejectUnauthorized: false,
                servername: host,
            }, () => {
                console.log('TLS Handshake SUCCESS!');
                console.log('Protocol:', tlsSocket.getProtocol());
                tlsSocket.end();
            });
            tlsSocket.on('error', (err) => {
                console.error('TLS upgrade error:', err.message);
                process.exit(1);
            });
        } else if (response === 'N') {
            console.log('Server rejected SSL. (Plain text only?)');
            process.exit(1);
        } else {
            console.log('Unexpected response from server.');
            process.exit(1);
        }
    });

    socket.on('error', (err) => {
        console.error('Connection error:', err.message);
        process.exit(1);
    });
}

test();
