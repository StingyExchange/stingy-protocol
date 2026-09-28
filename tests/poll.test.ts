import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { schedulePoll } from "../src/poll";

describe("poll: refresh cadence uses a fake clock, never a live timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires on the given interval, not before", () => {
    const task = vi.fn();
    schedulePoll(task, 15_000);
    expect(task).not.toHaveBeenCalled();
    vi.advanceTimersByTime(14_999);
    expect(task).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(task).toHaveBeenCalledTimes(1);
  });

  it("keeps firing on every subsequent interval", () => {
    const task = vi.fn();
    schedulePoll(task, 1_000);
    vi.advanceTimersByTime(3_500);
    expect(task).toHaveBeenCalledTimes(3);
  });

  it("stops firing once cancelled", () => {
    const task = vi.fn();
    const cancel = schedulePoll(task, 1_000);
    vi.advanceTimersByTime(2_000);
    cancel();
    vi.advanceTimersByTime(5_000);
    expect(task).toHaveBeenCalledTimes(2);
  });
});
