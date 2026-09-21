package Goo.Animations

import Goo
import System
import System.Collections.Generic

internal data struct TimelineStep(Duration float64, Action Action?) { }

/// Runs a sequence of timed animation actions on a window.
public sealed class Timeline {
    private let clock Anim[float64]
    private let steps List[TimelineStep]
    private var window Window?
    private var index int32
    private var revision int32
    private var looping bool
    private var running bool

    /// Gets whether the timeline is running.
    public prop Running bool {
        get -> running
    }

    /// Creates a timeline owned by a cell.
    /// @param owner cell that owns the timeline clock
    public init(owner Cell) {
        if owner == nil {
            throw ArgumentNullException("owner")
        }

        clock = owner.Animate(0.0, completed)
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

    /// Repeats the sequence until stopped.
    /// @returns this timeline
    public func Loop() Timeline {
        ensureStopped()
        looping = true
        return this
    }

    /// Starts or restarts the sequence.
    /// @param window window used to defer step handoffs
    public func Play(window Window) {
        if window == nil {
            throw ArgumentNullException("window")
        }
        if steps.Count == 0 {
            throw InvalidOperationException("A timeline requires at least one step.")
        }

        this.window = window
        index = 0
        running = true
        revision++
        advance(revision)
    }

    /// Stops the sequence.
    public func Stop() {
        running = false
        revision++
        clock.Set(0.0)
    }

    private func add(duration float64, action Action?) {
        ensureStopped()
        if !Double.IsFinite(duration) || duration < 0.0 {
            throw ArgumentOutOfRangeException("duration")
        }

        steps.Add(TimelineStep{Duration: duration, Action: action})
    }

    private func ensureStopped() {
        if running {
            throw InvalidOperationException("A running timeline cannot be changed.")
        }
    }

    private func completed(value float64) {
        if !running || value < 1.0 {
            return
        }

        let expected = revision
        if let host = window {
            if !host.TryPost(() -> advance(expected)) {
                running = false
            }
        } else {
            running = false
        }
    }

    private func advance(expected int32) {
        if !running || expected != revision {
            return
        }
        if index == steps.Count {
            if !looping {
                running = false
                return
            }
            index = 0
        }

        let step = steps[index]
        index++
        if let action = step.Action {
            action()
        }
        if !running || expected != revision {
            return
        }

        clock.Set(0.0)
        clock.To(1.0, Motion.Tween(step.Duration, Easing.Linear))
    }
}
