'use strict';

import { SequenceNumberGenerator } from '.';

describe('SequenceNumberGenerator', function () {
  it('the first sequence number shall be one ', function () {
    const generator = new SequenceNumberGenerator();
    expect(generator.future()).toBe(1);
  });

  it('the second sequence number shall be two ', function () {
    const generator = new SequenceNumberGenerator();
    expect(generator.next()).toBe(1);
    expect(generator.next()).toBe(2);
  });

  it('the sequence number should roll over to 1 after reaching four billion', function () {
    const generator = new SequenceNumberGenerator();

    const max_counter_value = SequenceNumberGenerator.MAXVALUE;
    generator._set(max_counter_value);

    expect(generator.future()).toBe(max_counter_value);
    expect(generator.next()).toBe(max_counter_value);

    expect(generator.future()).toBe(1);
    expect(generator.future()).toBe(1);
  });
});
