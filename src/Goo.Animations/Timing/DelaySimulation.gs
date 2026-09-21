package Goo.Animations

import Goo
import System

internal class DelaySimulation : Simulation {
    private let start float64
    private let delay float64
    private let simulation Simulation

    internal init(start float64, delay float64, simulation Simulation) {
        if simulation == nil {
            throw InvalidOperationException("motion specification returned nil")
        }

        this.start = start
        this.delay = delay
        this.simulation = simulation
    }

    public override func Position(elapsed float64) float64 {
        if elapsed < delay {
            return start
        }

        return simulation.Position(elapsed - delay)
    }

    public override func Velocity(elapsed float64) float64 {
        if elapsed < delay {
            return 0.0
        }

        return simulation.Velocity(elapsed - delay)
    }

    public override func Done(elapsed float64) bool -> elapsed >= delay && simulation.Done(elapsed - delay)
}
