import { ArdiumKbdPipe } from './kbd.pipe';

describe('KbdPipe', () => {
  it('create an instance', () => {
    const pipe = new ArdiumKbdPipe();
    expect(pipe).toBeTruthy();
  });
});
