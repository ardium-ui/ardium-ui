import { ArdiumKbdPipe } from './kbd.pipe';

describe('KbdPipe', () => {
  it('should create an instance', () => {
    const pipe = new ArdiumKbdPipe();
    expect(pipe).toBeTruthy();
  });
  it('should return a value', () => {
    const pipe = new ArdiumKbdPipe();
    expect(pipe.transform('1', true)).not.toThrow();
  });
});
