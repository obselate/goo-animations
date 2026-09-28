package Goo.Animations

import Goo
import System
import System.Collections.Generic

internal data struct TimelineStep(Duration float64, Action Action?) { }

/// Runs a sequence of timed actions on a cell-owned motion clock.
public sealed class Timeline {
    private let clock Anim[float64]
    private let steps List[TimelineStep]
    private var index int32
    private var revision int32
    private var looping bool
    private var running bool
    private var dispatchingAction bool
    private var finishLoop bool

    /// Gets whether the timeline is running.
    public prop Running bool {
        get -> !clock.IsDisposed && running && (clock.Running || dispatchingAction)
    }

    /// Creates a timeline owned by a cell.
    /// @param owner cell that owns the timeline clock
    public init(owner Cell) {
        if owner == nil {
            throw ArgumentNullException("owner")
        }

        clock = owner.Animate(0.0, (value float64) -> { })
        clock.Completed += completed
        steps = List[TimelineStep]()
    }

    /// Appends a timed action.
    /// @param duration step duration in seconds, including zero
    /// @param action action run at the start of the step
    /// @returns this timeline
    public func Run(duration float64, action Action) Timeline {
        if action == nil {
            throw ArgumentNullException("action")
        }

        add(duration, action)
        return this
    }

    /// Appends a timed pause.
    /// @param duration pause duration in seconds, including zero
    /// @returns this timeline
    public func Hold(duration float64) Timeline {
        add(duration, nil)
        return this
    }

    /// Repeats the sequence until stopped. Reduced or disabled motion finishes the current iteration, then stops.
    /// @returns this timeline
    public func Loop() Timeline {
        ensureAlive()
        ensureStopped()
        looping = true
        return this
    }

    /// Starts or restarts the sequence.
    public func Play() {
        ensureAlive()
        if steps.Count == 0 {
            throw InvalidOperationException("A timeline requires at least one step.")
        }

        clock.Set(0.0)
        index = 0
        finishLoop = false
        running = true
        revision++
        advance(revision)
    }

    /// Starts or restarts the sequence. Retained for source compatibility.
    /// @param window ignored; the cell-owned motion clock schedules handoffs
    public func Play(window Window) {
        if window == nil {
            throw ArgumentNullException("window")
        }
        Play()
    }

    /// Stops the sequence.
    public func Stop() {
        running = false
        finishLoop = false
        revision++
        clock.Set(0.0)
    }

    private func add(duration float64, action Action?) {
        ensureAlive()
        ensureStopped()
        if !Double.IsFinite(duration) || duration < 0.0 {
            throw ArgumentOutOfRangeException("duration")
        }

        steps.Add(TimelineStep{Duration: duration, Action: action})
    }

    private func ensureStopped() {
        if Running {
            throw InvalidOperationException("A running timeline cannot be changed.")
        }
    }

    private func ensureAlive() {
        if clock.IsDisposed {
            throw ObjectDisposedException("Timeline")
        }
    }

    private func completed(reason MotionCompletionReason) {
        if !running {
            return
        }

        if reason != MotionCompletionReason.Finished && looping {
            finishLoop = true
        }

        advance(revision)
    }

    private func advance(expected int32) {
        if !running || expected != revision {
            return
        }
        if clock.IsDisposed {
            running = false
            return
        }
        if index == steps.Count {
            if !looping {
                running = false
                return
            }
            if finishLoop {
                running = false
                finishLoop = false
                return
            }
            index = 0
        }

        let step = steps[index]
        index++
        if let action = step.Action {
            dispatchingAction = true
            try {
                action()
            } catch (error Exception) {
                running = false
                finishLoop = false
                revision++
                clock.Set(0.0)
                throw error
            } finally {
                dispatchingAction = false
            }
        }
        if !running || expected != revision || clock.IsDisposed {
            if clock.IsDisposed {
                running = false
            }
            return
        }

        clock.Set(0.0)
        clock.To(1.0, Motion.Tween(step.Duration, Easing.Linear))
    }
}
