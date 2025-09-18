import { Query } from '../src/query';

async function main() {
  const query = new Query();
  const stream = await query.getScannerDataStream();
  const chunks: Buffer[] = [];

  stream.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
    console.log(`Received ${chunk.length} bytes`);
  });

  stream.on('end', () => {
    const completeData = Buffer.concat(chunks);
    const jsonData = JSON.parse(completeData.toString());
    console.log('Stream finished.');
    console.log(jsonData);
  });
}

main();
