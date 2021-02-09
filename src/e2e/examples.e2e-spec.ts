import { connectToServerExample } from '../examples/simple.connect.example';

describe('Examples', () => {
  it('should connect to the server', async () => {
    await connectToServerExample();
  });
});
