import { ArdiumIconPipe } from './icon.pipe';

describe('IconPipe', () => {
    it('should create an instance', () => {
        const pipe = new ArdiumIconPipe();
        expect(pipe).toBeTruthy();
    });
    it('should not throw', () => {
        const pipe = new ArdiumIconPipe();
        expect(pipe.transform('home')).not.toThrow();
    });
    it('should return the correct values', () => {
        const pipe = new ArdiumIconPipe();
        expect(pipe.transform('home')).toBe('home');
        expect(pipe.transform('radio_button_unchecked')).toBe(
            'radio_button_unchecked',
        );
        expect(pipe.transform('radio button unchecked')).toBe(
            'radio_button_unchecked',
        );
        expect(pipe.transform('radio-button-unchecked')).toBe(
            'radio_button_unchecked',
        );
        expect(pipe.transform('radio button-unchecked')).toBe(
            'radio_button_unchecked',
        );
        expect(pipe.transform('radio_button unchecked')).toBe(
            'radio_button_unchecked',
        );
        expect(pipe.transform('RADIO_butToN uncHecKed')).toBe(
            'radio_button_unchecked',
        );
    });
});
